import { useEffect, useReducer, useRef } from "react";

const initialState = {
  toasts: [],
  id: 1,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "active":
      const newToasts = [
        ...state.toasts,
        {
          text: `I am Number ${Math.floor(Math.random() * 100)} Toast`,
          id: Date.now().toString(),
          timer: 10,
        },
      ];
      return { ...state, toasts: newToasts };

    case "inActive":
      const removeToasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
      return { ...state, toasts: removeToasts };

    case "tick":
      return {
        ...state,
        toasts: state.toasts
          .map((toast) =>
            toast.id === action.payload
              ? { ...toast, timer: toast.timer - 1 }
              : toast
          )
          .filter((toast) => toast.timer > 0), // Remove toast when timer reaches 0
      };

    default:
      throw new Error("Action Unknown");
  }
};

export default function App() {
  const [{ toasts }, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <button onClick={() => dispatch({ type: "active" })}>Show Toast</button>
      {toasts.length > 0 && <Toasts toasts={toasts} dispatch={dispatch} />}
    </>
  );
}

function Toasts({ toasts, dispatch }) {
  return (
    <div style={{ position: "absolute", top: "0", right: "0" }}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          dispatch={dispatch}
          text={toast.text}
          id={toast.id}
          timer={toast.timer}
        />
      ))}
    </div>
  );
}

function Toast({ dispatch, text, id, timer }) {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      dispatch({ type: "tick", payload: id });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [id, dispatch]);

  // const handleClose = useCallback(() => {
  //   clearInterval(intervalRef.current);
  //   dispatch({ type: "inActive", payload: id });
  // }, [dispatch, id]);

  const handleClose = function () {
    dispatch({ type: "inActive", payload: id });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ccc",
        padding: "5px",
        gap: "5px",
        margin: "10px",
      }}
    >
      <p>{text}</p>
      <button onClick={handleClose}>X</button>
      <div>{timer} seconds remaining</div>
    </div>
  );
}
