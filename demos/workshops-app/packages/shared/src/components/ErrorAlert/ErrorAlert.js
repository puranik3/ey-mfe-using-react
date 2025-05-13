import { Alert } from "react-bootstrap";

// props -> { error: Error }
const ErrorAlert = ({ error }) => {
    return (
        <Alert variant="danger">
            {error.message}
        </Alert>
    );
}

export default ErrorAlert;