import { FC } from "react";
import Form from "react-bootstrap/Form";
import { Circle, Square, Trash } from "react-bootstrap-icons";
import { usePollDispatch, usePollState } from "../../context/pollContext";

interface AnswerProps {
    questionIndex: number,
    answerIndex: number
}

const Answer:FC<AnswerProps> = ({ questionIndex, answerIndex }) => {

    const poll = usePollState();
    const pollDispatch = usePollDispatch();

    const answer = poll.questions[questionIndex].answers[answerIndex];
    const question = poll.questions[questionIndex];

    const errors: any = poll.errors;
    const errorKey = `questions[${questionIndex}].answers[${answerIndex}]`;

    const renderIcon = () => {
        switch(question.type) {
            case 'SELECT':
                return <div className="me-1 "><span >{ answerIndex + 1 }.</span></div> 
            case 'RADIO':
                return <div className="me-1 "><Circle ></Circle></div>
            case 'CHECKBOX':
                return <div className="me-1 "><Square ></Square></div>
        }
    }

    return (
        <>
            <div className="d-flex align-items-center mb-2 answer-item">
                { renderIcon() }
                <Form.Control
                    type="text"
                    value={answer.content}
                    placeholder="Respuesta"
                    onChange={(e) => {
                        pollDispatch({
                            type: "answercontent",
                            payload: {
                                answerIndex,
                                index: questionIndex,
                                content: e.target.value
                            }
                        })
                    }}
                    isInvalid={!!errors[`${errorKey}.content`]}
                />
                <span data-tip="Eliminar respuesta">
                    <Trash className="ms-1 delete-answer"
                        onClick={()=> pollDispatch({
                            type: "removeanswer",
                            payload: { index: questionIndex, answerId: answer.id }
                        })}
                    ></Trash>
                </span>
            </div>
            <div className="invalid-feedback d-block mb-2">
                { errors[`${errorKey}.content`] }
            </div>
        </>
    );
}

export default Answer;