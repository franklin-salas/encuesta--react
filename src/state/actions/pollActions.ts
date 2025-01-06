export type PollActions =
    { type: 'pollcontent', content: string } |
    { type: 'questioncontent', payload: { index: number, content: string} } |
    { type: 'answercontent', payload: { index: number, answerIndex: number, content: string} } |
    { type: 'changequestiontype', payload: { index: number, value: string } } |
    { type: 'newquestion', index: number } |
    { type: 'newanswer', index: number } |
    { type: 'removequestion', questionId: String } |
    { type: 'removeanswer', payload: { index: number, answerId: string } } |
    { type: 'orderquestions', payload: { source: number, destination: number } } |
    { type: 'seterrors', errors: {} } |
    { type: 'resetformpoll' };
    









