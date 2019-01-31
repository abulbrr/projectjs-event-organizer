let options
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
});
var EventsList = LocalStorage.getEvents();

function filterClicked(e) {
    e.preventDefault()
    render()
}
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
    let filter = $('#filterForm').elements['filter'].value;
    console.log(filter)
    switch (filter) {
        case 'nsfw':
            list = CollectionUtils.filter(list, (element) => {
                return element.isNsfw == true
            })
            break;
        case 'sfw':
            list = CollectionUtils.filter(list, (element) => {
                return element.isNsfw == false
            })
            break;
        case 'awaited':
            list = CollectionUtils.filter(list, (element) => {
                return element.atendees.length != 0
            })
            break;
        case 'archived':
            list = CollectionUtils.filter(list, (element) => {
                return element.archived == true
            })
            break;

        case 'all':
        default:
            break;
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

function ratingSubmitClicked(eventId) {
    let ratingInput = $('#ratingInput' + eventId).value
    console.log(ratingInput)
    if(ratingInput > 10 || ratingInput < 1)
    {
        alert('Invalid rating please put a rating between 1 and 10')
        return
    }
    let event = LocalStorage.getEventById(eventId)
    let user = LocalStorage.getLoggedInUser()

    let isUserAtendee = CollectionUtils.find( event.atendees, (atendee)=> {
        return user.uuid == atendee
    } )

    if(isUserAtendee == false)
    {
        console.log('We are sorry, you are not attending this event, you can not rate it')
        return
    }

    if(event == false)
    {
        console.log('error retrieving the event data')
        return
    }
    
    event.rating += 1000 +parseInt(ratingInput)
    LocalStorage.updateEvent(event)
    render()
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
    char += event.archived == true ? '~ ' : ' '
    li.appendChild(HtmlCreator.createElement('h4', {}, "Name: " + char + event.name))
    li.appendChild(HtmlCreator.createElement('p', {}, "id: " + event.uuid))
    li.appendChild(HtmlCreator.createElement('p', {}, "is nsfw: " + event.isNsfw))
    li.appendChild(HtmlCreator.createElement('p', {}, 'date: ' + event.date))
    li.appendChild(HtmlCreator.createElement('p', {}, 'price: ' + event.price))
    li.appendChild(HtmlCreator.createElement('p', {}, ' archived: ' + ((event.archived == true) ? 'true' : 'false')))

    let rating = event.rating
    if(rating != 0) {
        let ratersCount = Math.floor(rating / 1000)
        rating = Math.round((rating % 1000) / ratersCount)
        rating = Math.round(rating / 10 * 6)

    }
    else {
        rating = 'Rating not set yet and will be updated'
    }
    
    li.appendChild(HtmlCreator.createElement('p', {}, ' rating: ' + rating))


    if (event.archived == true)
        li.appendChild(HtmlCreator.createElement('input', {
            type: 'number',
            id: 'ratingInput' + event.uuid,
            placeholder: 'Rating',
            min: '0', max: '10',
            validate: 'true',
        }))
    li.appendChild(HtmlCreator.createElement('button', { class: 'btn', eventId: event.uuid, onClick: 'ratingSubmitClicked(this.eventId)' }, 'submit'))
    li.appendChild(HtmlCreator.createElement('p', {}, ' clients paid: ' + ((event.atendees.length * event.price) + ' on this event')))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'removeItem(eventId)',
        class: 'btn-small'
    },
        'delete'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'AddClientToEvent(this.eventId)',
        class: 'btn-small ' + (event.archived == true ? 'disabled' : null)
    },
        'add client to event'))

    if (event.archived != true) {

        li.appendChild(HtmlCreator.createElement('button', {
            eventId: event.uuid,
            onClick: 'archiveEvent(this.eventId)',
            class: 'btn-small'
        },
            'archive'))
    }

    li.appendChild(HtmlCreator.createElement('br'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'filterAtendees(this.eventId, "Female")',
        class: 'btn-small'
    },
        'Women'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'filterAtendees(this.eventId, "Male")',
        class: 'material-icons',
        class: 'btn-small'
    },
        'Men'))

    li.appendChild(HtmlCreator.createElement('button', {
        eventId: event.uuid,
        onClick: 'filterAtendees(this.eventId)',
        class: 'btn-small'
    },
        'ALL Clients'))



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

function archiveEvent(eventId) {
    event = LocalStorage.getEventById(eventId)

    if (event == undefined) {
        console.log('Could not archive the event')
        return
    }

    event.archived = true;
    LocalStorage.updateEvent(event)
    render()
}

function removeAtendee(eventId, userId) {
    LocalStorage.removeAtendeeFromEvent(eventId, userId)
    filterAtendees(eventId)
}

