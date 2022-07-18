import React from 'react'
import { BsTrash } from 'react-icons/bs'
import { BiTask } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useContext } from 'react';
import { Context } from '../index';
import { db } from '../index'
import { collection, onSnapshot, query, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const Task = ( {task} ) => {
  const {auth} = useContext(Context)
  const [user] = useAuthState(auth);

  const [tasksData, getTasks] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "tasks"))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let tasksArray = []
      querySnapshot.forEach((doc) => {
        tasksArray.push({...doc.data(), id: doc.id})
      })
      getTasks(tasksArray)
    })
    return () => unsub()
    },[]);

  const startTask = id => {
    const current = tasksData.find(t => t.id === id)
    if (current.taskId !== user.uid){
      updateDoc(doc(db, "tasks", id), {
        startedBy: user.uid
      })
    }
  }

  const deleteTask = id => {
    const current = tasksData.find(t => t.id === id)
    if (current.taskId === user.uid){
      deleteDoc(doc(db, "tasks", id))
    }
  }

  return (
    <div className='task'>
      <button className='task__content' onClick={() => startTask(task.id)}>
        {task.taskId === user.uid ? '' : <div className="task__content__ico"> <BiTask size={32}></BiTask> </div>}
        <div className="task__content__text">
          <h1 className='task__title'>{task.title}</h1>
          <p className='task__sub_title'>{task.author}</p>
          <p className='task__sub_title'>{task.email}</p>
        </div>
      </button>
      <button className='task__remove' onClick={() => deleteTask(task.id)}>
      {task.taskId === user.uid ? <BsTrash size={32}></BsTrash> : ''}
      </button>
    </div>
  )
}

export default Task