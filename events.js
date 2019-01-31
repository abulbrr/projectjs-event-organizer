let options
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
});
var EventsList = LocalStorage.getEvents();
render();
function render(criteria = '') {
    $('#Events').innerHTML = ''
    let list = EventsList;

    if (criteria != '') {
        if (criteria == 'nameFilter') {
            let value = $('#nameFilter').value
            console.log(value)
            let temp = CollectionUtils.find(list, (element) => {
                console.log(element.name == value)
                return element.name == value
            })
            if (temp != false) { 
                list = []
                list.push(temp)
            }
        }
    }

    if ($('#mostAttended').checked == true) {
        console.log('most attended')
        let temp = CollectionUtils.max(EventsList)
        if (temp != false) {
            list = []
            list.push(CollectionUtils.max(EventsList))

        }

        console.log(list)
    }

    if ($('#sfw').checked == true) {
        console.log('is safe for work')
        list = CollectionUtils.filter(list, (element) => {
            return element.isNsfw == false
        })
    }

    for (let index = 0; index < list.length; index++) {
        const event = list[index];
        renderEvent(event, index)

    }
}

console.log('EventsList: ', EventsList);
function $(query) {
    return document.querySelector(query);
}

function renderEvent(event, index) {

    const card = HtmlCreator.createElement('div', { class: 'card' })
    const cardContent = HtmlCreator.createElement('div', { class: 'card-content' })
    const li = HtmlCreator.createElement('li', { id: 'li' + index, class: 'collection-item' })

    $('#Events').appendChild(card)
    card.appendChild(cardContent)
    cardContent.appendChild(li)
    let char = event.isNsfw ? '*' : '#'
    char += event.price == '' ? '!' : '$'
    li.appendChild(HtmlCreator.createElement('h4', {}, "Name: " + char + event.name))
    li.appendChild(HtmlCreator.createElement('p', {}, "id: " + event.uuid))
    li.appendChild(HtmlCreator.createElement('p', {}, "is nsfw: " + event.isNsfw))
    li.appendChild(HtmlCreator.createElement('p', {}, 'date: ' + event.date))
    li.appendChild(HtmlCreator.createElement('p', {}, 'price: '+ event.price))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'removeItem(eventId)',
        class: 'material-icons'
    },
        'delete'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'AddClientToEvent(this.eventId)',
        class: 'material-icons'
    },
        'event_available'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'filterAtendees(this.eventId, "Female")',
        class: 'material-icons'
    },
        'pregnant_woman'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'filterAtendees(this.eventId, "Male")',
        class: 'material-icons'
    },
        'face'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'filterAtendees(this.eventId)',
        class: 'material-icons'
    },
        'sentiment_satisfied'))

    const ul = HtmlCreator.createElement('ul', { id: 'ul' + index })
    const atendeesli = HtmlCreator.createElement('li', { id: event.uuid + 'atendeesList' })
    li.appendChild(ul)
    ul.appendChild(atendeesli)
    filterAtendees(event.uuid)

}



function removeItem(uuid) {
    LocalStorage.removeEvent(uuid, () => {
        alert("deleting items: sucess")
        window.location.reload(true);

    })
}

function AddClientToEvent(eventUuid) {
    if (!LocalStorage.isUserLoggedIn()) {
        window.location.href = "./login.html"
        return
    }

    let user = LocalStorage.getLoggedInUser();
    if (user == undefined) {
        alert("problem getting the user")
        return
    }
    LocalStorage.addClientToEvent(user, eventUuid)
    filterAtendees(eventUuid)
}
function filterAtendees(eventUuid, filter) {

    const event = LocalStorage.getEventById(eventUuid)
    let atendees = event.atendees
    const atendeesList = document.getElementById(event.uuid + 'atendeesList')
    atendeesList.innerHTML = ''

    if (filter != undefined)
        atendees = CollectionUtils.filter(atendees, (atendee) => {
            const user = LocalStorage.getUserById(atendee)
            return user.sex == filter
        })

    CollectionUtils.forEach(atendees, (atendee) => {
        const user = LocalStorage.getUserById(atendee)
        let p = HtmlCreator.createElement('p', {}, 
        'id: ' + user.uuid +
        ' age: ' + user.age +
        ' sex: ' + user.sex + 
        ' wallet: ' + user.wallet +
        ' attending events count: ' + user.events.length)
        let btn = HtmlCreator.createElement('button', {
            eventId: event.uuid,
            atendeeId: user.uuid,
            onClick: 'removeAtendee(this.eventId, this.atendeeId)',
            class: 'material-icons'
        },
            'close')
        

        atendeesList.appendChild(p)
        atendeesList.appendChild(btn)
    })
}

function removeAtendee(eventId, userId) {
    LocalStorage.removeAtendeeFromEvent(eventId, userId)
    filterAtendees(eventId)
}

