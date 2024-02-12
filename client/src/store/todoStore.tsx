import { create } from 'zustand'

interface TodoState {
  tasks: Record<string, string>[]
  setTasks: (newTasks: Record<string, string>[]) => void,
  showTasks: string,
  setShowTasks: (value: string) => void,
}

const useTodoStore = create<TodoState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  showTasks: 'all',
  setShowTasks: (value) => set({ showTasks: value })
}))

export default useTodoStore;