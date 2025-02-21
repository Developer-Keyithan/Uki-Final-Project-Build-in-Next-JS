import'./Button.css'

function Button(props) {
    return (
        <div>
            <button className='btn-component' style={props.style}>{props.textContent}</button>
        </div>
    )
}

export default Button
