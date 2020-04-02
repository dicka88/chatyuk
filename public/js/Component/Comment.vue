<template>
    <article class="media mb-1">
        <figure class="media-left">
            <p class="image is-64x64">
                <img class="is-rounded" :src="item.path_photo">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                    <strong :class="itsYou ? 'gold':''">{{ item.name }}</strong> <small><a v-if="item.github == 'true'" target="_blank" :href="url_github">@{{ item.login }}</a><span v-else>anonymous</span></small> <small>{{ seen }} ago</small>
                    <br>
                    {{ item.message }}
                </p>
            </div>
            <nav class="level is-mobile">
                <div class="level-left">
                    <a class="level-item">
                        <span  class="icon is-small"><i class="fa fa-reply"></i></span>
                    </a>
                    <a class="level-item">
                        <span class="icon is-small"><i class="fa fa-retweet"></i></span>
                    </a>
                    <a class="level-item">
                        <span class="icon is-small"><i class="fa fa-heart"></i></span>
                    </a>
                </div>
            </nav>
        </div>
    </article>
</template>

<script>
    module.exports =  {
        props: ['item'],
        data() {
            return {
                seen: 0
            }
        },
        computed: {
            url_github: function() {
                return 'https://github.com/' + this.item.login
            },
            itsYou() {
                return this.item.login == login ? true : false
            }
        },
        methods: {
            seenMethod() {
                let vm = this

                let counterTime = this.counterTime()

                vm.seen = counterTime.result

                setInterval(() => {
                    vm.seen = this.counterTime().result
                }, counterTime.interval)
            },
            counterTime() {
                let total = Date.now() - this.item.time
                let date = new Date(total)

                let min = Math.floor(total / 1000 / 60)
                let hour = Math.floor(total / 1000 / 60 / 60)
                let day = Math.floor(total / 1000 / 60 / 60 / 24)
                let month = Math.floor(total / 1000 / 60 / 60 / 24 / 30)
                let year = Math.floor(total / 1000 / 60 / 60 / 24 / 30 / 12)
                let result
                let interval

                if (year) {
                    interval = 60 * 60 * 24 * 30 * 12 * 1000
                    result = `${year}y ${month}mth`
                } else if (month) {
                    interval = 60 * 60 * 24 * 30 * 1000
                    result = `${month}mth`
                } else if (day) {
                    interval = 60 * 60 * 24 * 1000
                    let real_hour = hour - (day * 24)
                    result = `${day}d ${real_hour}h`
                } else if (hour) {
                    interval = 60 * 60 * 1000
                    let realmin = min - (hour * 60)
                    result = `${hour}h ${realmin}m`
                } else {
                    interval = 60 * 1000
                    result = min + 'm'
                }

                return {
                    interval,
                    result
                }
            }
        },
        created() {
            this.seenMethod()
        },
        mounted() {
            window.scrollTo(0, document.body.scrollHeight);
        },
        updated() {
            this.seenMethod()
        }
    }
</script>
