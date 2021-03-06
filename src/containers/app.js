import React from 'react';
import {connect} from 'react-redux';
import { ActionCreators } from 'redux-undo';

import Notes from 'components/notes';
import {
    currentRootNoteSelector,
    viewSelector,
    globalOrderSelector,
    pathToRootSelector,
    notesSelector,
} from 'queries';

import {
    addNote,
    updateNote,
    deleteNote,
    setActiveNote,
    updateNotePosition,
    toggleNoteChildren,
    importOPML,
    saveState,
} from 'actions';

const App = React.createClass({
    render() {
        const {dispatch, notes, curRootNote, pathToRoot, view, globalOrder} = this.props;
        return (
            <div className="container">
                <Notes curRootNote={curRootNote}
                       pathToRoot={pathToRoot}
                       globalOrder={globalOrder}
                       view={view}
                       notes={notes}
                       onNoteAdd={attrs => dispatch(addNote(attrs))}
                       onNoteUpdate={attrs => dispatch(updateNote(attrs))}
                       onNoteUpdatePosition={attrs => dispatch(updateNotePosition(attrs))}
                       onNoteDelete={attrs => dispatch(deleteNote(attrs))}
                       onSetActiveNote={attrs => dispatch(setActiveNote(attrs))}
                       onToggleNoteChildren={attrs => dispatch(toggleNoteChildren(attrs))}
                       onImportOPML={attrs => dispatch(importOPML(attrs))}
                       onUndo={() => dispatch(ActionCreators.undo())}
                       onRedo={() => dispatch(ActionCreators.redo())}
                       saveState={attrs => dispatch(saveState(attrs))}
                />
            </div>
        );
    },
});

function mapStateToProps(state, props) {
    return {
        curRootNote: currentRootNoteSelector(state, props),
        notes: notesSelector(state, props),
        pathToRoot: pathToRootSelector(state, props),
        view: viewSelector(state, props),
        globalOrder: globalOrderSelector(state, props),
    };
}

export default connect(mapStateToProps)(App);
