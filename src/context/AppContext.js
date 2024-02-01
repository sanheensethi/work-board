import React, { createContext, useState, useContext, useEffect } from "react";
import endpoints from "../config/endpoints";
import uuid from 'react-uuid';
export const AppContext = createContext();

export function useTask() {
  return useContext(AppContext);
}

export const AppProvider = ({ children }) => {
  const [taskStatusList, setTaskStatusList] = useState({});
  const [viewItems, setViewItems] = useState([]);
  const [taskId, setTaskId] = useState(null);

  useEffect(()=>{
    const fetchData = async () => {
      const response = await fetch(endpoints['get-json']);
      if (!response.ok){
        throw new Error('Failed to fetch data');
      }
      let newViewItems = await response.json();
      newViewItems.forEach((obj)=>{
        obj.tasks.sort((a,b)=>(parseInt(a.row)-parseInt(b.row)));
      });
      setViewItems(newViewItems);
    }
    fetchData();
  },[])

  useEffect(()=>{
    const fetchStatusData = async () => {
      const response = await fetch(endpoints['get-tags']);
      if (!response.ok){
        throw new Error('Failed to fetch data');
      }
      const states = await response.json()
      setTaskStatusList(states);
    }
    fetchStatusData();
  },[])

  const updateAllTasks = (viewId,tasks) => {
    const newViewItems = viewItems.map((view) =>
      view.id === viewId
        ? {
            ...view,
            tasks: tasks
          }
        : view
    );
    fetch(endpoints["set-json"], {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Accept': '*/*'
      },
      body: JSON.stringify(newViewItems)
  })
    setViewItems(newViewItems);
  }

  const addTask = (title, viewId) => {
    // do api call to add task to backend
    const newTask = {
      id: uuid(),
      title,
      row: 0,
      description: "",
      
    };
    const newViewItems = viewItems.map((view) =>
      view.id === viewId ? { ...view, tasks: [newTask,...view.tasks] } : view
    );
    newViewItems.forEach((obj)=>{
      obj.tasks.sort((a,b)=>(parseInt(a.row)-parseInt(b.row)));
    });
    newViewItems.map((view)=>{
      return view.tasks.forEach((task,index)=>{return (task.row = index)})
    })
    fetch(endpoints["set-json"], {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Accept': '*/*'
      },
      body: JSON.stringify(newViewItems)
  })
    setViewItems(newViewItems);
  };

  const addView = (name) => {
    async function addNewView() {
      const response = await fetch(endpoints['get-json']);
      if (!response.ok){
        throw new Error('Failed to fetch data');
      }
      let newViewItems = await response.json();
      let newId = newViewItems.length;
      let colors = ["slate","blue","red","violet","pink","green"]
      let randomColor = colors[Math.floor(Math.random() * colors.length)];
      let data = {
        name:name,
        color:`bg-${randomColor}-300/20`,
        id:newId,
        tasks:[]
      }
      fetch(endpoints["set-json"], {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': '*/*'
        },
        body: JSON.stringify(newViewItems)
      })
      newViewItems.push(data);
      setViewItems(newViewItems)
    }
    addNewView();
    
    // setViewItems([...viewItems, newView]);
  };

  const deleteTask = (taskId, viewId) => {
    // call api to backend to delete task in backend
    const newViewItems = viewItems.map((view) =>
      view.id === viewId
        ? {
            ...view,
            tasks: view.tasks.filter((task) => task.id !== taskId),
          }
        : view
    );
    newViewItems.forEach((obj)=>{
      obj.tasks.sort((a,b)=>(parseInt(a.row)-parseInt(b.row)));
    });
    newViewItems.map((view)=>{
      return view.tasks.forEach((task,index)=>{return (task.row = index)})
    })
    fetch(endpoints["set-json"], {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Accept': '*/*'
      },
      body: JSON.stringify(newViewItems)
  })
    setViewItems(newViewItems);
  };

  const updateTask = (taskId, viewId, title, description) => {
    // call api to backend to update the task in backend
    const newViewItems = viewItems.map((view) =>
      view.id === viewId
        ? {
            ...view,
            tasks: view.tasks.map((task) =>
              task.id === taskId ? { ...task, title, description } : { ...task }
            ),
          }
        : view
    );
    newViewItems.forEach((obj)=>{
      obj.tasks.sort((a,b)=>(parseInt(a.row)-parseInt(b.row)));
    });
    newViewItems.map((view)=>{
      return view.tasks.forEach((task,index)=>{return task.row = index})
    })
    fetch(endpoints["set-json"], {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Accept': '*/*'
      },
      body: JSON.stringify(newViewItems)
  })
    setViewItems(newViewItems);
  };

  const changeView = (currentTask, fromViewId, toViewId) => {
    // console.log({ currentTask, fromViewId, toViewId });
    // const currentTaskId = currentTask.id;
    const newTask = {
      id: uuid(),
      title: currentTask.title,
      row: 0,
      status: taskStatusList[toViewId],
      description: currentTask.description,
    };
    const newViewItems = viewItems.map((view) =>{
      if (view.id === toViewId){
        return { ...view, tasks: [newTask,...view.tasks] }
      }
       else{
        return view
       }
    }
    );
    newViewItems.forEach((obj)=>{
      obj.tasks.sort((a,b)=>(parseInt(a.row)-parseInt(b.row)));
    });
    newViewItems.map((view)=>{
      return view.tasks.forEach((task,index)=>{return task.row = index})
    })
    setViewItems(newViewItems);
    // remove task from previous view
    // call api to delete that currentTaskId
    const newViewItems2 = newViewItems.map((view) =>
      view.id === fromViewId
        ? {
            ...view,
            tasks: view.tasks.filter((task) => task.id !== currentTask.id),
          }
        : view
    );
    newViewItems2.map((view)=>{
      return view.tasks.forEach((task,index)=>{return (task.row = index)})
    })
    fetch(endpoints["set-json"], {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Accept': '*/*'
      }, 
      body: JSON.stringify(newViewItems2)
  })
    setViewItems(newViewItems2);
    // deleteTask(currentTask.id, fromViewId);
  };

  const value = {
    viewItems,
    addTask,
    addView,
    setTaskId,
    taskId,
    deleteTask,
    updateTask,
    changeView,
    updateAllTasks
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
