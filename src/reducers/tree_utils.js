import {fromJS} from 'immutable';

export function notesIterator(notes, note, counter, acc, noteCallback, childCallback) {
    let newCounter = counter;
    let res = noteCallback(note, counter, acc);
    let newAcc = res.acc;
    let newNote = res.note;
    if (!newNote.get('children') || newNote.get('children').count() <= 0) {
        return {counter: newCounter, acc: newAcc, note: newNote};
    }
    newNote = newNote
          .update('children', children =>
                  children
                  .map((childId, id) => {
                      let child = notes.getIn([childId.toString()]);
                      if (childCallback) {
                          child = childCallback(child, children, id, newCounter, acc); // callback
                      }
                      const expand = notesIterator(notes, child, newCounter + 1,
                                                   newAcc, noteCallback, childCallback);
                      newCounter = expand.counter;
                      newAcc = Object.assign(newAcc, expand.acc);
                      return expand.note;
                  })
                 );
    return {counter: newCounter, note: res.note, acc: res.acc};
}

// TODO ненужна?
export function tree(notes, rootNote=notes.getIn(['0'])) {
    return rootNote.update('children', children => children.map((childId) => {
        return tree(notes, notes.getIn([childId]));
    }));
}

export function order(notes, rootNote=notes.getIn(['0'])) {
    return rootNote.getIn(['children']).reduce((acc, childId) => {
        return acc.concat(order(notes, notes.getIn([childId])));
    }, [rootNote.get('id')]);
}

export function getNotesTree(notes, rootNote=notes.getIn(['0'])) {
    // let childCallback = (child, children, id, counter, acc) => {
    //     let newChild = child
    //         .set('order', id)
    //         .set('prevId', children.get((Number(id) - 1).toString()));
    //     return newChild;
    // };
    // let noteCallback = (note, counter, acc) => {
    //     const newNote = note.set('globalOrder', counter);
    //     acc.notesOrder[counter] = note;
    //     return {note: newNote, acc};
    // };
    // let startAcc = {notesOrder: {}};
    // let {counter, note, acc} = notesIterator(notes, rootNote, 0, startAcc,
    //                                     noteCallback, childCallback);
    // // console.log("notes", note.toJS());
    // return {tree: note, order: fromJS(acc.notesOrder)};
    return {tree: tree(notes, rootNote), order: order(notes, rootNote)};
}
