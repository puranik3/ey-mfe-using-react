import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ variant = 'success' }) => {
    return (
        <div className="d-flex justify-content-center">
            <Spinner
                animation="border"
                role="status"
                variant={variant}
            >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

// old way of setting default value
// LoadingSpinner.defaultProps = {
//  variant: 'success'
// }

export default LoadingSpinner;