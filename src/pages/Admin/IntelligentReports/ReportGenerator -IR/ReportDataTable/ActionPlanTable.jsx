import React from "react";
import { Form } from "react-bootstrap";

export default function ActionPlanTable() {
    return (
        <div className="commonTable dataTable actionPlanTable mb-4">
            <div className="table-responsive datatable-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Questions</th>
                            <th className="w-1 text-center">Edit</th>
                            <th className="w-1 text-center">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={2} className='font-weight-bold'>Monthly One-On-Ones</td>
                            <td></td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220'>"In your opinion, how ""open and honest"" is the communication at the organization?"</td>
                            <td className='text-wrap min-w-220'>
                                In addition to regular team meetings, schedule 10-15 minute one-on-one meetings with each employee on a monthly basis (base time and frequency on your number of employees). Require each employee to set an agenda for that meeting of issues he/she wants to discuss.
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit01"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className='font-weight-bold'>Active Listening</td>
                            <td></td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220'>What are the obstacles to open communication?</td>
                            <td className='text-wrap min-w-220'>
                                Develop the habit of active listening. Listen with the intent of understanding your employees and not just reacting to what they are saying. Let people know you understand them by paraphrasing the main points that they share with you. Use the following behaviors when speaking with others: 1) Direct your attention to the speaker and avoid checking e-mail or messages on your phone; 2) Listen for the total message and try to view the speaker’s thoughts and ideas from his/her perspective; and 3) Paraphrase what the speaker has said to ensure your understanding of the total message.
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit02"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className='font-weight-bold'>Open Door Policy</td>
                            <td></td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220'>What are the specific communication issues that we should be dealing with in a more open manner?</td>
                            <td className='text-wrap min-w-220'>
                            "Create an ""open door"" policy. Let your employees know that they are always welcome to approach you with questions, comments, and concerns. Commit to always answering honestly and without judgment or defensiveness."
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit03"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className='font-weight-bold'>Responding is better than Reacting</td>
                            <td></td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220'>What can be done to create a more open and honest communication environment?</td>
                            <td className='text-wrap min-w-220'>
                                When confronted with a position with which you disagree, force yourself not to respond. Continue to listen and don’t begin formulating your response until the speaker has finished.
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit04"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className='font-weight-bold'>Communication Concerns</td>
                            <td></td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220 border-bottom-0' rowSpan={3}>What can your Manager do to create a more open and honest communication environment?</td>
                            <td className='text-wrap min-w-220'>
                                Initiate a discussion with your employees about their concerns regarding the quality of the communication between management and employees. Ask your workgroup to brainstorm ways of improving the communication and implement the most practical ideas.
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit05"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220'>
                                "Make a deliberate effort to spend an equal amount of time with each employee, making ""small talk"" and handling concerns. Intentionally solicit feedback/input from everyone at team meetings. Do not dismiss any ideas, even if they appear to be impractical. Rather, ask specific questions and explore the suggestions made."
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit06"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className='text-wrap min-w-220'>
                                Organizations reward the behaviors that they truly value. Therefore, develop and implement a reward system that acknowledges and praises open and honest communication of others. For example, you could host celebrations when your employees display open and honest communication, especially if it results in a positive experience for co-workers, customers, etc.
                            </td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    id="edit07"
                                    label=""
                                    name="surveyname"
                                />
                            </td>
                            <td className='text-center'>
                                <Form.Group className="form-group mb-0">
                                    <Form.Check
                                        className="me-0"
                                        type="checkbox"
                                        label={<div className="primary-color"></div>}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}