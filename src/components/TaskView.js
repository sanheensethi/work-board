import { useState } from "react";

import { useTask } from "../context/AppContext";
import TaskDrawer from "./TaskDrawer";
// import { colors } from "../config/colors";

function TaskView({ view, viewId }) {
  const [isDownInputVisible, setIsDownInputVisible] = useState(false);
  const [isUpInputVisible, setIsUpInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { changeView, setTaskId, addTask, updateAllTasks, updateTask } = useTask();

  // * Adds a new task to the view
  const handleNewTask = () => {
    if (inputValue) {
      addTask(inputValue, view.id);
      setInputValue("");
    }
    document.getElementById("input").focus();
  };

  // * in case the user did not press enter and clicked outside the input field
  // * this will add the task to the view
  const handleBlur = () => {
    if (!inputValue) {
      setIsDownInputVisible(false);
      setIsUpInputVisible(false);
    }
    handleNewTask();
  };

  const toggleTaskDrawer = (taskId) => {
    setIsDrawerOpen(true);
    setTaskId(taskId);
  };

  const handleDrag = (event, task, fromViewId) => {
    event.dataTransfer.setData("TASK-ID", JSON.stringify({ task, fromViewId }));
  };

  const handleOnDrop = (e) => {
    const { task, fromViewId } = JSON.parse(e.dataTransfer.getData("TASK-ID"));
    if(fromViewId !== viewId){
      const Tasks = [...view.tasks];
      changeView(task, fromViewId, viewId);
    }
  };

  const handleOnDrop2 = (e) => {
    const { task, fromViewId } = JSON.parse(e.dataTransfer.getData("TASK-ID"));
    if(fromViewId == viewId){
      const updatedTasks = [...view.tasks];
      const draggedTaskIndex = updatedTasks.findIndex((t) => t.id === task.id);
      const dropIndex = e.currentTarget.attributes.dataid.value; // fixed div row number
      updatedTasks.splice(draggedTaskIndex, 1);
      updatedTasks.splice(dropIndex, 0, task);
      updatedTasks.forEach((task,index)=>{
        return task.row = index; 
      })
      console.log(updatedTasks)
      updatedTasks.sort((a,b)=>{
        return a.row - b.row;
      })
      updateAllTasks(viewId,updatedTasks);
    }
  };
  
  let clr = view.color;

  return (
    <div
      className="flex flex-col items-center gap-4 min-w-[320px] p-4"
      onDrop={handleOnDrop}
      onDragOver={(e) => e.preventDefault()}
    >

      <div className={`flex items-center justify-between w-full font-semibold`}>
        <div className="flex gap-2  text-gray-400">
          
          <div className={`text-slate-700 px-2 rounded-md ${clr}`}>
            {view.name}
          </div>
          <div>{view.tasks.length}</div>
        </div>
        <button
          onClick={() => setIsDownInputVisible(true)}
          className=" text-gray-400 cursor-pointer"
        >
          +
        </button>
      </div>
      <div className={`onebox flex flex-col w-full gap-1.5 flex-nowrap p-4 rounded-xl ${clr}`}>
      <button
          className="text-gray-400 text-left px-1 text-sm mt-2 cursor-pointer focus:outline-blue-400/80"
          onClick={() => setIsUpInputVisible(true)}
        >
          + New Task
        </button>
        {isUpInputVisible && (
          <div className="flex px-3 py-1.5 bg-white drop-shadow-sm rounded w-full cursor-pointer border border-gray-200">
            <input
              id="input"
              type="text"
              className="w-full text-slate-700 placeholder:font-normal font-semibold text-sm outline-none"
              placeholder="Add Task Title..."
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewTask();
                }
              }}
              onBlur={handleBlur}
            />
          </div>
        )}
      {view.tasks.map((task,index) => (
          <div
            key={index} dataid={index} onDrop={handleOnDrop2}
            className={`${clr} flex px-3 py-1.5 rounded w-full`}
          >
            <div className="text-slate-700  font-semibold text-sm">
                  <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDrag(e, task, viewId)}
                onClick={() => toggleTaskDrawer(task.id)}
                className="flex px-3 hover:scale-105 hover:bg-gray-50 duration-300 py-1.5 bg-white drop-shadow-sm rounded w-full cursor-pointer border border-gray-200"
              >
                <div className="text-slate-700 font-semibold text-sm">
                  {task.title}
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          className="text-gray-400 text-left px-1 text-sm mt-2 cursor-pointer focus:outline-blue-400/80"
          onClick={() => setIsDownInputVisible(true)}
        >
          + New Task
        </button>
        {isDownInputVisible && (
          <div className="flex px-3 py-1.5 bg-white drop-shadow-sm rounded w-full cursor-pointer border border-gray-200">
            <input
              id="input"
              type="text"
              className="w-full text-slate-700 placeholder:font-normal font-semibold text-sm outline-none"
              placeholder="Add Task Title..."
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewTask();
                }
              }}
              onBlur={handleBlur}
            />
          </div>
        )}
      </div>
      <TaskDrawer
        currentView={view}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />
    </div>
  );
}

export default TaskView;
