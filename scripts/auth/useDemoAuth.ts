import { useEffect, useState } from 'react'
import { readDemoAuthed, subscribeDemoAuth, writeDemoAuthed } from '../patterns/authDemo'

/** 演示鉴权：登录页写入 session，壳层据此跳转 `/login` ↔ `/` */
export function useDemoAuth() {
  const [isAuthed, setIsAuthed] = useState(readDemoAuthed)

  useEffect(() => subscribeDemoAuth(() => setIsAuthed(readDemoAuthed())), [])

  return {
    isAuthed,
    onLogout: () => writeDemoAuthed(false),
  }
}
