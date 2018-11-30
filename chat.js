const CLIENT_ID = 'kbFLiGX7HoaJYdXe';



const drone = new ScaleDrone(CLIENT_ID, {

  data: {

    name: getRandomName(),

    color: getRandomColor(),

  },

});



let members = [];



drone.on('open', error => {

  if (error) {

    return console.error(error);

  }

  console.log('Successfully connected to Scaledrone');



  const room = drone.subscribe('observable-room');

  room.on('open', error => {

    if (error) {

      return console.error(error);

    }

    console.log('Successfully joined room');

  });



  room.on('members', m => {

    members = m;

    updateMembersDOM();

  });



  room.on('member_join', member => {

    members.push(member);

    updateMembersDOM();

  });



  room.on('member_leave', ({id}) => {

    const index = members.findIndex(member => member.id === id);

    members.splice(index, 1);

    updateMembersDOM();

  });



  room.on('data', (text, member) => {

    if (member) {

      addMessageToListDOM(text, member);

    } else {

    }

  });

});



drone.on('close', event => {

  console.log('Connection was closed', event);

});



drone.on('error', error => {

  console.error(error);

});



function getRandomName() {

  const adjs = ["帅气的", "浪漫的", "邪恶的", "美丽的", "安静的", "脑残的", "性感的", "裸奔的", "中二的", "秀气的", "英俊的", "恶心的", "白毛的", "恶臭的", "搞基的", "冷酷的", "头皮发麻的", "孤独的", "令人犯罪的", "坏了的"]

  const nouns = ["美男子", "野兽", "月光", "大雕", "沙壁", "教授", "肌肉男", "大胸妹", "女孩", "猎人", "厨师", "猫", "狗", "叶子", "夕阳", "打鸡王", "真男人", "基佬", "王子", "单身狗", "太阳", "鸟", "蝴蝶", "排泄物", "肉便器"]

  return (

    adjs[Math.floor(Math.random() * adjs.length)] +

    "_" +

    nouns[Math.floor(Math.random() * nouns.length)]

  );

}



function getRandomColor() {

  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);

}



//DOM.SFU



const DOM = {

  membersCount: document.querySelector('.members-count'),

  membersList: document.querySelector('.members-list'),

  messages: document.querySelector('.messages'),

  input: document.querySelector('.message-form__input'),

  form: document.querySelector('.message-form'),

};



DOM.form.addEventListener('submit', sendMessage);



function sendMessage() {

  const value = DOM.input.value;

  if (value === '') {

    return;

  }

  DOM.input.value = '';

  drone.publish({

    room: 'observable-room',

    message: value,

  });

}



function createMemberElement(member) {

  const { name, color } = member.clientData;

  const el = document.createElement('div');

  el.appendChild(document.createTextNode(name));

  el.className = 'member';

  el.style.color = color;

  return el;

}



function updateMembersDOM() {

  DOM.membersCount.innerText = `${members.length} users in room:`;

  DOM.membersList.innerHTML = '';

  members.forEach(member =>

    DOM.membersList.appendChild(createMemberElement(member))

  );

}



function createMessageElement(text, member) {

  const el = document.createElement('div');

  el.appendChild(createMemberElement(member));

  el.appendChild(document.createTextNode(text));

  el.className = 'message';

  return el;

}



function addMessageToListDOM(text, member) {

  const el = DOM.messages;

  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;

  el.appendChild(createMessageElement(text, member));

  if (wasTop) {

    el.scrollTop = el.scrollHeight - el.clientHeight;

  }

}