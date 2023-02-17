import { useState, useEffect, useRef } from "react";
import './styles/Timer.css'

export const Timer = ({timeout}) => {
  const [timer, setTimer] = useState(100);
  const intervalRef = useRef(); // usamos ref para guardar el intervalo y despues usamos ese ref para frenar el interval

  useEffect(() => {
    interval();
  }, []);

  const start = () => {
    setTimer((timer) => {
      if (timer === 0) {
        clearInterval(intervalRef.current); // frena el interval
        timeout();
        return 0;
      }
      return timer - 1;
    });
  };

  const interval = () => {
    intervalRef.current = setInterval(() => {
      start();
    }, 1000);
  };

  return (<h1>Tiempo restante: {timer > 0 ? timer : "Sin tiempo"}</h1>);
};
