import { useEffect } from "react";

export default function (cb, time, deps = []) {
  useEffect(() => {
    const id = setTimeout(cb, time);
    return () => clearTimeout(id);
  }, deps);
}
