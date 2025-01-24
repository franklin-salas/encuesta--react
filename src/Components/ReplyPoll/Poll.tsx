import { FC, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { createPollReply, getPollWithQuestions } from "../../services/PollService";
import { PollReplyDetail, Question, UserAnswer } from "../../types";
import ReplyQuestion from "./ReplyQuestion";
import { Alert, Spinner } from "react-bootstrap";
import { Check2Circle } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";

interface PollProps {
    id: string
}

const Poll:FC<PollProps> = ({ id }) => {

    const [poll, setPoll] = useState<any>(null);
    const [user, setUser] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [userAnswers, setUserAnswers] = useState<any>({});
    const [isPollAnswered, setIsPollAnswered] = useState(false);
    const [sendingData, setSendingData] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchPoll();
    }, []);

    const fetchPoll = async () => {
        try {
            const res: any = await getPollWithQuestions(id);

            const data = res.data;

            data.questions = data.questions.sort((a: Question, b: Question) => a.questionOrder - b.questionOrder);

            setPoll(data);

        } catch (error: any) {
            if (error.response.status === 500) {
                history.replace("/");
            }
        }
    }

    const handleQuestionChange = (answer: UserAnswer) => {

        const answers = { ...userAnswers };
        
        switch(answer.type) {
            case "RADIO":
            case "SELECT": {
                answers[answer.questionId] = { questionId: answer.questionId, answerId: answer.answer }
                break;
            }
            case "CHECKBOX": {
                if (answers[answer.questionId]) {
                    const arr = answers[answer.questionId].answers;
                    const index = arr.indexOf(answer.answer);
                    if (index === -1) {
                        arr.push(answer.answer);
                    } else {
                        arr.length < 2 ? delete answers[answer.questionId]: arr.splice(index, 1);
                    }
                } else {
                    answers[answer.questionId] = { questionId: answer.questionId, answers: [answer.answer] }
                }
                break;
            }
        }

        setUserAnswers(answers);
    }


    const renderQuestions = () => {
        return poll.questions.map((question: Question) => <ReplyQuestion
            changeCallback={handleQuestionChange}
            question={question} key={question.id}
        ></ReplyQuestion>)
    }


    const prepareForm = async () => {
        setErrors({});

        if (Object.keys(userAnswers).length !== poll.questions.length) {
            setErrors((current: any) => {
                return { ...current, allQuestionsAnswered: "Por favor responda todas las preguntas" }
            });
            return;
        }

        let replies: PollReplyDetail[] = [];

        for (let key in userAnswers) {
            if (userAnswers[key].answers) {
                userAnswers[key].answers.forEach((id: number) => replies.push({
                    questionId: userAnswers[key].questionId, answerId: id
                }))
            } else {
                replies.push(userAnswers[key])
            }
        }

        sendForm(replies);        
    }

    const sendForm = async (replies: PollReplyDetail[]) => {
        try {
            setSendingData(true);
            await createPollReply({
                pollReplies: replies,
                poll: poll.id,
                user: user
            });
            setSendingData(false);
            setIsPollAnswered(true);
        } catch(errors: any) {
            if (errors.response) {
                errors.response.status === 400 && setErrors(errors.response.data.errors)
            }
            setSendingData(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col sm="10" md="10" lg="8" className="mx-auto mt-5 mb-2">
                    {
                        isPollAnswered &&
                        <div className="d-flex align-items-center flex-column poll-answered-container">
                            <Check2Circle className="success-icon"></Check2Circle>
                            <Alert show={isPollAnswered} variant="success">
                                Muchas gracias por tu respuesta!
                            </Alert>
                        </div>
                    }

                    {
                        poll && !isPollAnswered && <>
                            <h2>{ poll.content }</h2><hr></hr>
                           
                            <FloatingLabel className="mb-3" controlId="user" label="Nombre"> 
                            {/* <Form.Group className="mb-3" controlId="user"> */}
                            <Form.Control 
                                    value={user}
                                    onChange={e => setUser(e.target.value)}
                                    type="text"
                                    placeholder="e.g. Jonathan"
                                    isInvalid={!!errors.user}
                                />   
                                <Form.Control.Feedback type="invalid">
                                    {errors.user}    
                                </Form.Control.Feedback>                             
                            {/* </Form.Group> */}
                            </FloatingLabel>
                             

                            <div>
                                { renderQuestions() }
                            </div>


                          
                            <Button type="submit" onClick={prepareForm} className="mb-3">
                                {sendingData ? <>
                                    <Spinner
                                        animation="border"
                                        as="span"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></Spinner>&nbsp;
                                    <span>Enviando respuesta...</span>
                                </>: 
                                <>Enviar Respuesta</>
                                }
                            </Button>
                            
                        
                        </>
                    }

                    
                {
                                errors.allQuestionsAnswered && <Alert className="mt-2" variant="danger">
                                    { errors.allQuestionsAnswered }
                                </Alert>
                            }
                </Col>
                

            </Row>
        </Container>
    );
}

export default Poll;