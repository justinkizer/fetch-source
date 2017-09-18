import React from 'react';

const SubHeader = props => {
  return (
    <div className='sub-header' id='sub-header'>
      <div className='tag-count-summary'>
        <p>Source Summary (i.e. HTML Tags and their Frequency):</p>
        <ul className='tag-count-list'>
          { props.tagsData }
        </ul>
      </div>
      <div className='source-buttons'>
        <button
          className={ props.selectedSource === props.formattedSource ?
            'sticky-button' : ''
          }
          onClick={ props.selectFormattedSource }
        >
          Formatted Source
        </button>
        <button
          className={
            props.selectedSource === props.rawSource ? 'sticky-button' : ''
          }
          onClick={ props.selectRawSource }
        >
          Raw Source
        </button>
      </div>
    </div>
  );
};

export default SubHeader;
