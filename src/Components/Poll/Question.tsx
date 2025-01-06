import { FC, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import ReactTooltip from "react-tooltip";
import { usePollDispatch, usePollState } from "../../context/pollContext";
import Answer from "./Answer";
import { PlusCircle, PlusLg, Trash } from "react-bootstrap-icons";
import { QUESTION_TYPE_OPTIONS } from "../../utils/constants";

interface QuestionProps {
    index: number
}

const Question:FC<QuestionProps> = ({ index }) => {

    const poll = usePollState();
    const pollDispatch = usePollDispatch();

    const question = poll.questions[index];

    const errors: any = poll.errors;
    const errorKey = `questions[${index}]`;

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [question.answers.length]);

    const renderAnswers = () => {
        return question.answers.map((answer, answerIndex) => (
                <Answer 
                    key={answer.id} 
                    questionIndex={index} 
                    answerIndex={answerIndex} />                    
            )
        )
    }

    return (
        <Card className="mt-3">
            <Card.Body>
                <Row>
                    <Col sm="12" md="6" className="mb-4">
                        <Form.Control 
                            type="text"
                            placeholder="Pregunta"
                            onChange={(e) => pollDispatch({
                                type: "questioncontent",
                                payload: {
                                    content: e.target.value,
                                    index
                                }
                            })}
                            value={question.content}
                            isInvalid={!!errors[`${errorKey}.content`]}
                        />
                        <Form.Control.Feedback type="invalid">
                            { errors[`${errorKey}.content`] }
                        </Form.Control.Feedback>
                    </Col>

                    <Col sm="12" md="6" className="mb-4">
                        <Form.Control 
                            as="select"
                            className="form-select"
                            value={question.type}
                            onChange={(e) => {
                                pollDispatch({
                                    type: "changequestiontype",
                                    payload: {
                                        index,
                                        value: e.target.value
                                    }
                                })
                            }}
                            isInvalid={!!errors[`${errorKey}.type`]}
                        >
                            <option>Tipo de pregunta</option>
                            {
                                QUESTION_TYPE_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{ option.name }</option>
                                    )
                                )
                            }
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            { errors[`${errorKey}.type`] }
                        </Form.Control.Feedback>
                    </Col>
                </Row>

                <Container>
                    { renderAnswers() }

                    <Button size="sm" className="mt-2" variant="outline-primary"
                        onClick={() => pollDispatch({
                            type: "newanswer",
                            index
                        })}
                    >
                        <PlusLg /> Añadir respuesta
                    </Button>
                </Container>

                <hr />

                <div className="d-flex justify-content-end">  
                    <span data-tip="Añadir pregunta">
                        <PlusCircle className="option-question-icon ms-1" 
                            onClick={() => pollDispatch({
                                type: "newquestion",
                                index
                            })}
                        ></PlusCircle>
                    </span>                

                    <span data-tip="Eliminar pregunta">
                        <Trash className="option-question-icon ms-1" 
                            onClick={() => pollDispatch({
                                type: "removequestion",
                                questionId: question.id
                            })}
                        ></Trash>
                    </span>
                </div>

                <ReactTooltip place="left" effect="solid" />

            </Card.Body>
        </Card>
    );
}

export default Question;