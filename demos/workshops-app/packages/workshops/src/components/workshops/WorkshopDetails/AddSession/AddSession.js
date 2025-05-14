import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { postSession } from '../../../../services/sessions';

const AddSession = () => {
    const { id } = useParams();;
    const navigate = useNavigate();

    const { register, formState: { errors }, getValues, handleSubmit } = useForm({
        mode: 'all'
    });

    const validateDurationAndLevel = () => {
        const duration = +getValues('duration');
        const level = getValues('level');

        if (level === 'Basic' && duration < 1) {
            return 'Basic level shold have minimum 1 hour duration';
        }

        if (level === 'Intermediate' && duration < 2) {
            return 'Intermediate level shold have minimum 2 hours duration';
        }

        if (level === 'Advanced' && duration < 3) {
            return 'Advanced level shold have minimum 3 hours duration';
        }

        return true;
    };

    const addSession = async (sessionData) => {
        const session = {
            ...sessionData,
            workshopId: id,
            upvoteCount: 0,
            sequenceId: +sessionData.sequenceId,
            duration: +sessionData.duration,
        };

        console.log(session);

        try {
            const newSession = await postSession(session);
            // toast("New session was added");
            alert("New session was added");
            navigate("/workshops/" + id);
        } catch (error) {
            // toast(error.message);
            alert(error.message);
        }
    };

    return (
        <div>
            <h1 className="d-flex justify-content-between align-items-center">
                Add a Session
                <Link to=".." className="btn btn-primary">
                    List of sessions
                </Link>
            </h1>

            <hr />

            <Form onSubmit={handleSubmit(addSession)}>
                <Form.Group className="mb-4" controlId="sequenceId">
                    <Form.Label>Sequence ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="The Sequence ID of the session (eg. 1, 2, 3...)"
                        {...register('sequenceId', { required: true, pattern: /^\d+$/ })}
                    />
                    {
                        errors.sequenceId && (
                            <div className="text-danger">
                                {
                                    errors.sequenceId?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.sequenceId?.type === 'pattern' && (
                                        <div>Sequence ID must be a positive integer</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name of the session, Eg. Programming 101 - Introduction to programming"
                        {...register('name', { required: true, pattern: /^[A-Za-z\d][A-Za-z\d .,'&_\/:+#@-]*$/ })}
                    />
                    {
                        errors.name && (
                            <div className="text-danger">
                                {
                                    errors.name?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.name?.type === 'pattern' && (
                                        <div>Name of the session has characters that are not allowed - Must begin with alphanumeric, and can have alphanumeric, spaces, and these characters only - .,'&_/:+#@-</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="speaker">
                    <Form.Label>Speaker</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name of the speaker(s). Eg. John Doe, Jane Doe"
                        {...register('speaker', { required: true, pattern: /^[A-Za-z][A-Za-z ]*(,\s*[A-Za-z][A-Za-z ]*)*$/ })}
                    />
                    {
                        errors.speaker && (
                            <div className="text-danger">
                                {
                                    errors.speaker?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.speaker?.type === 'pattern' && (
                                        <div>Comma-separated name(s) of speaker(s)</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="duration">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="The duration of the session in hours (eg. 2.5)"
                        {...register('duration', { required: true, pattern: /^\d+(\.\d+)?$/ })}
                    />
                    {
                        errors.duration && (
                            <div className="text-danger">
                                {
                                    errors.duration?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.duration?.type === 'pattern' && (
                                        <div>Only number with optional decimal part allowed</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="level">
                    <Form.Label>Level</Form.Label>
                    <Form.Select
                        aria-label="Level"
                        {...register('level', { required: true, validate: validateDurationAndLevel })}
                    >
                        <option disabled>-- Select the level --</option>
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </Form.Select>
                    {
                        errors.level && (
                            <div className="text-danger">
                                {
                                    errors.level?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.level?.type === 'validate' && (
                                        <div>The duration in insufficient for the selected level</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="abstract">
                    <Form.Label>Abstract</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        {...register('abstract', { required: true, minLength: 20, maxLength: 1024 })}
                    />
                    {
                        errors.abstract && (
                            <div className="text-danger">
                                {
                                    errors.abstract?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.abstract?.type === 'minLength' && (
                                        <div>Minimum 20 characters needed</div>
                                    )
                                }
                                {
                                    errors.abstract?.type === 'maxLength' && (
                                        <div>Maximum 1024 characters allowed</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>

                <Button type="submit">Add a session</Button>
            </Form>
        </div>
    );
};

export default AddSession;