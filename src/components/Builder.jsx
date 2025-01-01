import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './Sidebar';
// import DropZone from './DropZone';

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// Multiple card editors
import TextEditOption from './TextEditOption';
import TextAreaEditOption from './TextAreaEditOption';
import ImageEditOption from './ImageEditOption';
import ButtonEditOption from './ButtonEditOption';
import PageAttributes from './PageAttributesEditOption';
import WrapperAttributeEditOption from './WrapperAttributeEditOption';
import SectionEditOption from './SectionEditOption';
import SocialMediaEditOption from './SocialMediaEditOption';
import DividerEditOption from './DividerEditOption';
import SpacerEditOption from './SpacerEditOption';

import PageAttribute from './PageAttribute';
import TreeView from './TreeView';
import SourceCode from './SourceCode';

const Builder = () => {
  const { selectedEditor } = useSelector((state) => state.cardToggle);
  
  const {activeLeftTab, activeRightTab} = useSelector( (state) => state.navbar);

  console.log("selectedCard in builder: ", selectedEditor)

  const renderEditor = () => {
    switch (selectedEditor) {
      case 'pageAttribute':
        return <PageAttributes />;
      case 'wrapperAttribute':
        return <WrapperAttributeEditOption />;
      case 'sectionEditor':
        return <SectionEditOption />;
      case 'Text':
        return <TextEditOption />;
      case 'TextArea':
        return <TextAreaEditOption />;
      case 'Button':
        return <ButtonEditOption />;
      case 'Image':
        return <ImageEditOption />;
      case 'Divider':
        return <DividerEditOption />;
      case 'Space':
        return <SpacerEditOption />;
      case 'SocialMedia':
        return <SocialMediaEditOption />;
      default:
        return <PageAttributes />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '5px', padding: '10px' }}>

        {/* Sidebar for draggable items */}
        {activeLeftTab==='Contents' ? <Sidebar /> : <TreeView />}

        {/* Drop zone for placing items */}
        <PageAttribute />

        {/* Render Editor Conditionally */}
        {activeRightTab === 'Editor' ? renderEditor(): <SourceCode />}
      </div>
    </DndProvider>
  );
};

export default Builder;
