// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IBEP20 {
    
  /**
   * @dev Returns the amount of tokens in existence.
   */
  function totalSupply() external view returns (uint256);

  /**
   * @dev Returns the token decimals.
   */
  function decimals() external view returns (uint8);

  /**
   * @dev Returns the token symbol.
   */
  function symbol() external view returns (string memory);

  /**
  * @dev Returns the token name.
  */
  function name() external view returns (string memory);

  /**
   * @dev Returns the bep token owner.
   */
  function getOwner() external view returns (address);

  /**
   * @dev Returns the amount of tokens owned by `account`.
   */
  function balanceOf(address account) external view returns (uint256);

  /**
   * @dev Moves `amount` tokens from the caller's account to `recipient`.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
  function transfer(address recipient, uint256 amount) external returns (bool);

  /**
   * @dev Returns the remaining number of tokens that `spender` will be
   * allowed to spend on behalf of `owner` through {transferFrom}. This is
   * zero by default.
   *
   * This value changes when {approve} or {transferFrom} are called.
   */
  function allowance(address _owner, address spender) external view returns (uint256);

  /**
   * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * IMPORTANT: Beware that changing an allowance with this method brings the risk
   * that someone may use both the old and the new allowance by unfortunate
   * transaction ordering. One possible solution to mitigate this race
   * condition is to first reduce the spender's allowance to 0 and set the
   * desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   *
   * Emits an {Approval} event.
   */
  function approve(address spender, uint256 amount) external returns (bool);

  /**
   * @dev Moves `amount` tokens from `sender` to `recipient` using the
   * allowance mechanism. `amount` is then deducted from the caller's
   * allowance.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  /**
   * @dev Emitted when `value` tokens are moved from one account (`from`) to
   * another (`to`).
   *
   * Note that `value` may be zero.
   */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Emitted when the allowance of a `spender` for an `owner` is set by
   * a call to {approve}. `value` is the new allowance.
   */
  event Approval(address indexed owner, address indexed spender, uint256 value);
  
}
/**
 * Tracer Standard Vesting Contract
 */
contract Vesting is Ownable {
    mapping(address => uint256) public vestedAmount;
    mapping(address => uint256) public claimedAmount;

    struct Tier {
        uint256 tierId;
        uint256 amountMax;
    }
    uint256 public numberOfTiers;
    mapping(uint256 => Tier) public tiers;
    mapping(address => uint256) public whitelistOfTiers;     

    struct Schedule {
        uint256 totalAmount;
        uint256 claimedAmount;
        uint256 startTime;
        uint256 cliffTime;
        uint256 endTime;
        bool isFixed;
        address asset;
    }

    // user => scheduleId => schedule
    mapping(address => mapping(uint256 => Schedule)) public schedules;
    mapping(address => uint256) public numberOfSchedules;

    mapping(address => uint256) public locked;
    IBEP20 public immutable token;

    event Claim(address indexed claimer, uint256 amount);
    event Vest(address indexed to, uint256 amount);
    event Cancelled(address account);

    event NewVesting(address indexed investor, uint256 amount);

    constructor(IBEP20 _token) {
        token = _token;
    }

    /**
     * @notice Sets up a vesting schedule for a set user.
     * @dev adds a new Schedule to the schedules mapping.
     * @param account the account that a vesting schedule is being set up for. Will be able to claim tokens after
     *                the cliff period.
     * @param amount the amount of tokens being vested for the user.
     * @param asset the asset that the user is being vested
     * @param isFixed a flag for if the vesting schedule is fixed or not. Fixed vesting schedules can't be cancelled.
     * @param cliffDays the number of days that the cliff will be present at.
     * @param vestingDays the number of days the tokens will vest over (linearly)
     * @param startTime the timestamp for when this vesting should have started
     */
    function vest(
        address account,
        uint256 amount,
        address asset,
        bool isFixed,
        uint256 cliffDays,
        uint256 vestingDays,
        uint256 startTime
    ) public onlyOwner {
        // ensure cliff is shorter than vesting
        require(
            vestingDays > 0 && 
            vestingDays >= cliffDays &&
            amount > 0,
            "Vesting: invalid vesting params"
        );

        uint256 currentLocked = locked[asset];

        // require the token is present
        require(
            IBEP20(asset).balanceOf(address(this)) >= currentLocked + amount,
            "Vesting: Not enough tokens"
        );

        // create the schedule
        uint256 currentNumSchedules = numberOfSchedules[account];
        schedules[account][currentNumSchedules] = Schedule(
            amount,
            0,
            startTime,
            startTime + (cliffDays * 1 days),
            startTime + (vestingDays * 1 days),
            isFixed,
            asset
        );
        numberOfSchedules[account] = currentNumSchedules + 1;
        locked[asset] = currentLocked + amount;
        emit Vest(account, amount);
    }

    /**
     * @notice Sets up vesting schedules for multiple users within 1 transaction.
     * @dev adds a new Schedule to the schedules mapping.
     * @param accounts an array of the accounts that the vesting schedules are being set up for.
     *                 Will be able to claim tokens after the cliff period.
     * @param amount an array of the amount of tokens being vested for each user.
     * @param asset the asset that the user is being vested
     * @param isFixed bool setting if these vesting schedules can be rugged or not.
     * @param cliffDays the number of days that the cliff will be present at.
     * @param vestingDays the number of days the tokens will vest over (linearly)
     * @param startTime the timestamp for when this vesting should have started
     */
    function multiVest(
        address[] calldata accounts,
        uint256[] calldata amount,
        address asset,
        bool isFixed,
        uint256 cliffDays,
        uint256 vestingDays,
        uint256 startTime
    ) external onlyOwner {
        uint256 numberOfAccounts = accounts.length;
        require(
            amount.length == numberOfAccounts,
            "Vesting: Array lengths differ"
        );
        for (uint256 i = 0; i < numberOfAccounts; i++) {
            vest(
                accounts[i],
                amount[i],
                asset,
                isFixed,
                cliffDays,
                vestingDays,
                startTime
            );
        }
    }

    /**
     * @notice allows users to claim vested tokens if the cliff time has passed.
     * @param scheduleNumber which schedule the user is claiming against
     */
    function claim(uint256 scheduleNumber) external {
        Schedule storage schedule = schedules[msg.sender][scheduleNumber];
        require(
            schedule.cliffTime <= block.timestamp,
            "Vesting: cliff not reached"
        );
        require(schedule.totalAmount > 0, "Vesting: not claimable");

        // Get the amount to be distributed
        uint256 amount = calcDistribution(
            schedule.totalAmount,
            block.timestamp,
            schedule.startTime,
            schedule.endTime
        );

        // Cap the amount at the total amount
        amount = amount > schedule.totalAmount ? schedule.totalAmount : amount;
        uint256 amountToTransfer = amount - schedule.claimedAmount;
        schedule.claimedAmount = amount; // set new claimed amount based off the curve
        locked[schedule.asset] = locked[schedule.asset] - amountToTransfer;
        require(IBEP20(schedule.asset).transfer(msg.sender, amountToTransfer), "Vesting: transfer failed");
        emit Claim(msg.sender, amount);
    }

    /**
     * @notice Allows a vesting schedule to be cancelled.
     * @dev Any outstanding tokens are returned to the system.
     * @param account the account of the user whos vesting schedule is being cancelled.
     */
    function rug(address account, uint256 scheduleId) external onlyOwner {
        Schedule storage schedule = schedules[account][scheduleId];
        require(!schedule.isFixed, "Vesting: Account is fixed");
        uint256 outstandingAmount = schedule.totalAmount -
            schedule.claimedAmount;
        require(outstandingAmount != 0, "Vesting: no outstanding tokens");
        schedule.totalAmount = 0;
        locked[schedule.asset] = locked[schedule.asset] - outstandingAmount;
        require(IBEP20(schedule.asset).transfer(owner(), outstandingAmount), "Vesting: transfer failed");
        emit Cancelled(account);
    }

    /**
     * @return calculates the amount of tokens to distribute to an account at any instance in time, based off some
     *         total claimable amount.
     * @param amount the total outstanding amount to be claimed for this vesting schedule.
     * @param currentTime the current timestamp.
     * @param startTime the timestamp this vesting schedule started.
     * @param endTime the timestamp this vesting schedule ends.
     */
    function calcDistribution(
        uint256 amount,
        uint256 currentTime,
        uint256 startTime,
        uint256 endTime
    ) public pure returns (uint256) {
        // avoid uint underflow
        if (currentTime < startTime) {
            return 0;
        }

        // if endTime < startTime, this will throw. Since endTime should never be
        // less than startTime in safe operation, this is fine.
        return (amount * (currentTime - startTime)) / (endTime - startTime);
    }

    /**
     * @notice Withdraws CSPD tokens from the contract.
     * @dev blocks withdrawing locked tokens.
     */
    function withdraw(uint256 amount, address asset) external onlyOwner {
        require(
            token.balanceOf(address(this)) - locked[asset] >= amount,
            "Vesting: Can't withdraw"
        );
        require(token.transfer(owner(), amount), "Vesting: withdraw failed");
    }

     /**
     * @notice add multi investor to vesting.
     * @dev admin add the multi investor to vesting.
     */
    function addInvestors(address[] memory investors, uint256[] memory amounts) external onlyOwner {
        uint256 totalAmount = 0;
        uint256 length = investors.length;
        require(amounts.length == length, "ICL");

        for (uint256 i = 0; i < length; i++) {
            vestedAmount[investors[i]] += amounts[i];
            totalAmount += amounts[i];
            emit NewVesting(investors[i], amounts[i]);
        }

        token.transfer(owner(), totalAmount);
    }

     /**
     * @notice add investor to vesting.
     * @dev admin add the investor to vesting.
     */
    function addInvestor(address investor, uint256 amount) external onlyOwner {
        vestedAmount[investor] += amount;
        token.transfer(owner(), amount);
        emit NewVesting(investor, amount);
    }

    function setTiers(
        uint256[] calldata tierIds,
        uint256[] calldata amountsMax
    ) external onlyOwner {
        uint256 _numberOfTiers = tierIds.length;
        require(
            amountsMax.length == _numberOfTiers,
            "Tier: Array lengths differ"
        );
        for (uint256 i = 0; i < _numberOfTiers; i++) {
            require(
                tierIds[i] > 0 == true && amountsMax[i] > 0,
                "Tier: invalid tier params"
            );

            tiers[i] = Tier(
                tierIds[i],
                amountsMax[i]
            );
        }

        numberOfTiers = _numberOfTiers;
    }

    function setTierOfAccount(
        address account,
        uint256 indexOfTier
    ) external onlyOwner {
        require(
            indexOfTier >= 0 && indexOfTier < numberOfTiers,
            "Tier: index of tier is invalid"
        );

        whitelistOfTiers[account] = indexOfTier;
    }

    function gettierIdOfAccount(
        address account
    ) public view returns (uint256){
        uint256 indexOfTier = whitelistOfTiers[account];
        Tier storage _tier = tiers[indexOfTier];
        return _tier.tierId;
    }

    function getTierAmountMaxOfAccount(
        address account
    ) public view returns (uint256){
        uint256 indexOfTier = whitelistOfTiers[account];
        return tiers[indexOfTier].amountMax;
    }
}