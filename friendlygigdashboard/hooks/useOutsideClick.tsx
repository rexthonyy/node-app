import React, { FC, ReactNode, Ref, RefObject, useEffect, useRef } from "react"

interface ValidRefTarget {
  contains(target: EventTarget | null): any
}

export const useOutSiteClick = (ref: RefObject<ValidRefTarget>, handler: CallableFunction) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handler, ref])
}
