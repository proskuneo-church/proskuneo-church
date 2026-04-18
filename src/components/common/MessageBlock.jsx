export default function MessageBlock({ type = "info", title, message }) {
  return (
    <div className={`message-block message-${type}`}>
      {title ? <h4>{title}</h4> : null}
      {message ? <p>{message}</p> : null}
    </div>
  );
}
