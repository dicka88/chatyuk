const socket = io()
socket.on('connect', () => {
    socket.emit('user_connect', {
        user_name,
        sessionid: socket.id
    })
})

const root = new Vue({
    el: '#root',
    name: 'Comment page',
    components: {
        'comment-component': httpVueLoader('./js/Component/Comment.vue')
    },
    data() {
        return {
            user_id: user_id,
            login: login,
            username: user_name,
            github: is_github,
            avatar: url_avatar,

            article: [],
            userIsWriting: [],
            userOnline: [],
            message: '',
            pagination: 0,
            scrollDone: false,
            loadState: false,
            isOnline: true
        }
    },
    computed: {
        totalOnline() {
            return this.userOnline.length
        },
        url_github: function() {
            return 'https://github.com/' + this.login
        },
        userWriting() {
            let userTyping = this.userIsWriting.filter(user => this.username == user ? false : true)

            return (userTyping.length) ? userTyping.join(', ') + ' is typing a message' : false
        }
    },
    methods: {
        loadAllComment() {
            const vm = this
            this.loadState = true

            // axios load content limit 50
            const pagination = this.pagination * 50

            axios.get('/api/getcomment?pagination=' + pagination).then(res => {
                vm.loadState = false

                if (res.data.length == 0) {
                    return this.scrollDone = true
                }

                if (this.scrollDone) return

                this.article = [
                    ...res.data.reverse(),
                    ...this.article
                ]
            })
        },
        addComment(e) {
            e.returnValue = false
            if (!this.message.trim() || this.message.length > 500) return

            let newMessage = {
                user_id: this.user_id,
                time: Date.now(),
                login: this.login,
                name: this.username,
                github: this.github,
                path_photo: this.avatar,
                message: this.message.trim()
            }

            this.article = [
                ...this.article,
                newMessage
            ]

            this.message = ''

            socket.emit('send', newMessage)
        },
        writing() {
            if (this.message.length == 0) {
                socket.emit('stopWriting', this.username)
            } else {
                socket.emit('writing', this.username)
            }
        },
        stopWriting() {
            socket.emit('stopWriting', this.username)
        },
        socketListener() {
            vm = this

            // when someone send message
            socket.on('new message', content => {
                this.article = [
                    ...this.article,
                    content
                ]
            })

            // when someone writing
            socket.on('writing', users => {
                this.userIsWriting = users
            })

            // get all current online user
            socket.on('userOnline', user => {
                this.userOnline = user
            })
        },
        scrollToEnd() {
            window.scrollTo(0, document.body.scrollHeight);
        },
        networkListener() {
            let vm = this
            window.addEventListener('offline', (e) => {
                vm.isOnline = false
            })
            window.addEventListener('online', () => {
                vm.isOnline = true
            })
        }
    },
    created() {
        this.networkListener()
        this.loadAllComment()
    },
    updated() {
        this.scrollToEnd()
        document.querySelector(".text-message").focus()
    },
    mounted() {
        // auto resize input message
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY

            if (document.readyState !== 'complete') return

            if (this.scrollDone) return

            if (scroll < 300) {
                this.pagination = this.pagination + 1;
                this.loadAllComment()
            }
        })

        this.socketListener()
    },
    destroyed() {
        window.removeEventListener('scroll')
    }
})

// VANILLA
document.addEventListener('DOMContentLoaded', () => {
    const inputMessage = document.querySelector('.text-message')
    inputMessage.addEventListener('keyup', e => {
        // nothing
    })
})
