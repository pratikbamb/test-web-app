import './Error.css';

function Error(props) {
  const message = props.message;

  return (
    <>
      <div class="alert-wrapper error">
        <p>
          {message}
        </p>
      </div>
    </>
  )
}

export default Error;

