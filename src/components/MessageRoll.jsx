/**
 * MessageRoll React Component to display messages from json data source
 */
import React from 'react';
//Boostrap card component to display messages in right way
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

export class MessageRoll extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    ConvertDate(DateStr) {
        const DateObj = new Date(DateStr);
        return ( ('0' + DateObj.getDate()).slice(-2) + '.' + ('0' + ( DateObj.getMonth() + 1)).slice(-2) + '.' + DateObj.getFullYear() );
    }  
    
    BuildListFromJSON() {
        const Data = this.props.data;
        const SpacingY = this.props.SpacingY === undefined ? '' : 'my-' + this.props.SpacingY;
        return ( 
                <React.Fragment>  
                    {Data.map(message => (  
                      <Card className={ SpacingY } key={message.id.toString()}>  
                        <Card.Body>
                            <Card.Title>{ message.title }</Card.Title> 
                            <Card.Text>{ message.content }</Card.Text>                
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <Row className="align-items-center">
                                <Col className="pb-1">
                                    <Badge pill bg="dark">{ message.category }</Badge>
                                </Col>
                                <Col className="text-end">
                                    { this.ConvertDate(message.date) + ', ' + message.author }
                                </Col>
                            </Row>
                        </Card.Footer>
                      </Card>  
                    ))}         
                </React.Fragment> 
               );
    }
    
    render() {
        return (
                <React.Fragment>
                    { this.BuildListFromJSON() }
                </React.Fragment>         
               );
    }
};

export default MessageRoll;
