import React from 'react'
import { Form } from 'react-bootstrap'

function SearchForm(props) {
  return (
    <div>
    <Form>
    <Form.Group>
    <Form.Control
        style={{
        borderWidth: '2px',
        maxWidth: '200px'
        }}
        placeholder='Поиск...'
        value={props.searchText}
        onChange={(e) => props.onSearch(e.target.value)}
    />
    </Form.Group>
    </Form>
    </div>
  )
}

export default SearchForm