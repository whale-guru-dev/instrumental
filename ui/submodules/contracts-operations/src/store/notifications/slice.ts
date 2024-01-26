import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  timeout: number
  url?: string
  button?: {
    label: string
    path: string
  }
}

const initialState: { [key: string]: Notification } = {}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        message: string
        title?: string
        type: 'success' | 'warning' | 'error' | 'info'
        timeout?: number
        url?: string
        button?: {
          label: string
          path: string
        }
      }>
    ) => {
      const id = uuidv4()
      state[id] = {
        id: id,
        message: action.payload.message,
        timeout: action.payload.timeout ?? action.payload.type === 'error' ? 7000 : 5000,
        title: action.payload.title ?? action.payload.type.charAt(0).toUpperCase() + action.payload.type.slice(1),
        type: action.payload.type,
        url: action.payload.url,
        button: action.payload.button
      }
    },
    removeNotification: (
      state,
      action: PayloadAction<{
        id: string
      }>
    ) => {
      delete state[action.payload.id]
    },
  },
})

export const selectNotifications = (state: any) => state.notifications

export const {
  addNotification, removeNotification
} = notificationsSlice.actions

export default notificationsSlice.reducer
