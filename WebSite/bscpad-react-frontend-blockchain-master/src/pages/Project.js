import React from 'react';
import { useParams } from 'react-router-dom'

import Header from '../components/Header';
import Footer from '../components/Footer';
import Background from '../components/Background';
import TokenDetail from '../components/Project/TokenDetail';
import ProjectDetail from '../components/Project/ProjectDetail';
import TokenDetailNew from '../components/Project/TokenDetailNew';
import ProjectDetailNew from '../components/Project/ProjectDetailNew';

export default function Projects() {
    console.log(useParams().address)
    const option = useParams().address;
    return (
        <>
            <Header />
            <Background />
            { (option == 'option1') && (
                <>
                    <TokenDetail />
                    <ProjectDetail />
                </>
            ) || (option == 'option2') && (
                <>
                    <TokenDetailNew  />
                    <ProjectDetailNew  />
                </>
            )}

            
            
            <Footer />
        </>
    )
}