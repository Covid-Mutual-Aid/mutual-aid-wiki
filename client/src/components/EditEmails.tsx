import React, { useState, useEffect } from 'react'
import { Emails } from '../utils/types'

const validEmail = (email: string) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

type Props = {
  initEmails: Emails
  onChange: (emails: Emails) => void
}

const EditEmails = ({ initEmails, onChange }: Props) => {
  const [emails, setEmails] = useState(initEmails)
  const [currentEmail, setCurrentEmail] = useState('')
  const [color, setColor] = useState('inherit')

  useEffect(() => {
    onChange(emails)
  }, [emails])

  return null
  // <Form.Group>
  //   {initEmails.length > 0 ? (
  //     emails.map((email, i) => (
  //       <span key={i}>
  //         <Badge variant="success">
  //           {email}
  //           {` `}
  //           <span
  //             onClick={() => {
  //               setEmails(emails.filter(e => e !== email))
  //             }}
  //             style={{ padding: '3px', cursor: 'pointer' }}
  //           >
  //             ×
  //           </span>
  //         </Badge>
  //         {` `}
  //       </span>
  //     ))
  //   ) : (
  //     <Form.Text className="text-muted">One or more contact emails...</Form.Text>
  //   )}
  //   <InputGroup>
  //     <Form.Control
  //       style={{ color }}
  //       value={currentEmail}
  //       placeholder={`e.g "your_admin_email@gmail.com"`}
  //       onChange={(e: any) => {
  //         setColor('inherit')
  //         setCurrentEmail(e.target.value)
  //       }}
  //     />
  //     <InputGroup.Append>
  //       <Button
  //         variant={validEmail(currentEmail) ? 'primary' : 'secondary'}
  //         onClick={() => {
  //           if (validEmail(currentEmail)) {
  //             setEmails(emails => [...emails, currentEmail])
  //             setCurrentEmail('')
  //             setColor('inherit')
  //           } else {
  //             setColor('red')
  //           }
  //         }}
  //       >
  //         Add Email
  //       </Button>
  //     </InputGroup.Append>
  //   </InputGroup>
  // </Form.Group>
}

export default EditEmails
