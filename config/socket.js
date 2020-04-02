const io = require('socket.io')
const { insert_messages } = require('./database')

const initialize = (server) => {
	let socket = io(server)
	let userOnline = []
	let writing = []

	socket.on('connection', (e) => {
	    console.log("socket io connected id: " + e.id);

	    e.on('user_connect', user => {
	        userOnline.push(user)
	        socket.emit('userOnline', userOnline)
	        console.log("user online : ")
	        console.log(userOnline)
	    })

	    e.on('writing', user => {
	        if (writing.length > 5) return
	        if (writing.includes(user)) return

	        writing.push(user)
	        console.log(writing);

	        const resetWriting = setTimeout(() => {
	            writing = writing.filter(item => {
	                return item == user ? false : true
	            })
	            e.broadcast.emit('writing', writing)
	        }, 5000)

	        e.broadcast.emit('writing', writing)
	    })

	    e.on('stopWriting', user => {
	        writing = writing.filter(item => {
	            return item == user ? false : true
	        })
	        e.broadcast.emit('writing', writing)
	    })

	    e.on('send', content => {
	        insert_messages(content)
	        writing = writing.filter(item => {
	            return item == content.name ? false : true
	        })
	        e.broadcast.emit('writing', writing)
	        e.broadcast.emit('new message', content)
	    })

	    e.on('disconnect', () => {
	        console.log("disconnect : ")
	        userOnline = userOnline.filter(item => {
	            return (item.sessionid == e.id) ? false : true
	        })
	        console.log(userOnline)
	        socket.emit('userOnline', userOnline)
	    })
	})
}

module.exports = initialize
