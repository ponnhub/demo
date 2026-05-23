const { en_th_unit_mapping, KEYS, getUrlParameter } = require("../data/config")

const postbackFilledIn = ({text, filledInText, label, data, displayingText}) => {
    return {
        type: 'action',
        action: {
            type: 'postback',
            label: label || text,
            data: data || 'postingBack=true',
            ...displayingText ? { displayText: text } : { text: text },
            inputOption: 'openKeyboard',
            ... filledInText ? {fillInText: filledInText} : {}
          }
    }
}

const postbackToggleRichmenu = ({text, label, data, displayingText, closeRichmenu}) => {
    return {
        type: 'action',
        action: {
            type: 'postback',
            label: label || text,
            data: data || 'postingBack=true',
            ...displayingText ? { displayText: text } : { text: text },
            inputOption: closeRichmenu ? 'closeRichMenu' : 'openRichMenu'
          }
    }
}

class Payload {

    static quickReply = (title, items) => {
        return {
            type: 'text',
            text: title,
            quickReply: {
                items: items
            }
        }
    }

    static cameraRoll = (label) => {
        return {
            type: 'action',
            action: {
              type: 'cameraRoll',
              label: label || 'Send photo'
            }
          }
    }
    static chip = (text, label) => {
        return {
            type: 'action',
            action: {
              type: 'message',
              text: text,
              label: label || text.slice(0, 20)
            }
          }
    }

    static chipFilledIn = (params) => {
        return postbackFilledIn(params)
    }

    static chipToggleRichmenu = (params) => {
        return postbackToggleRichmenu(params)
    }

    t() {
        return {
            "fulfillmentMessages": [{
                "payload": {
                    "line": {
                        "type": "text",
                        "text": "สวัสดีค่ะพี่นิคกี้",
                        "quickReply": {
                            "items": [null, {
                                "type": "action",
                                "action": {
                                    "type": "message",
                                    "text": "ดูโปรไฟล์",
                                    "label": "ดูโปรไฟล์"
                                }
                            }]
                        }
                    }
                }
            }]
        }
    }
    profile(user) {

      const green = {
        "color_primary_0": {
          "color": "#2D882D"
        },
        "color_primary_1": {
          "color": "#88CC88"
        },
        "color_primary_2": {
          "color": "#55AA55"
        },
        "color_primary_3": {
          "color": "#116611"
        },
        "color_primary_4": {
          "color": "#004400"
        }
      }

      const lightblue = {
        "color_primary_0": {
          "color": "#0DAAFF"
        },
        "color_primary_1": {
          "color": "#A8E1FF"
        },
        "color_primary_2": {
          "color": "#77D0FF"
        },
        "color_primary_3": {
          "color": "#005A8A"
        },
        "color_primary_4": {
          "color": "#00456A"
        }
      }
      let colors = lightblue

        return {
            type: 'flex',
            altText: `โปรไฟล์ของ ${user.displayName}`,
            contents: {
                type: 'bubble',
                direction: 'ltr',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  paddingAll: '5px',
                  contents: [
                    {
                      type: 'text',
                      text: user.displayName ? `โปรไฟล์ของ ${user.displayName}` : 'Profile',
                      color: '#FFFFFFFF',
                      align: 'center',
                      contents: []
                    }
                  ]
                },
                hero: user.pictureUrl && {
                  type: 'image',
                  url: user.pictureUrl,
                  size: 'full',
                  aspectRatio: '1:1',
                  aspectMode: 'cover'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  paddingAll: '5px',
                  contents: [
                    {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
                      paddingAll: '10px',
                      backgroundColor: '#00000028',
                      cornerRadius: '10px',
                      contents: [
                        {
                          type: 'box',
                          layout: 'horizontal',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              paddingAll: '2px',
                              backgroundColor: colors.color_primary_1.color,
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  text: user.rank || '[ยศ]',
                                  align: 'center',
                                  contents: []
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 4,
                              paddingAll: '2px',
                              backgroundColor: colors.color_primary_1.color,
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  text: user.person ? user.person.name : '[ชื่อ นามสกุล]',
                                  weight: 'bold',
                                  align: 'center',
                                  wrap: true,
                                  contents: []
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              backgroundColor: colors.color_primary_1.color,
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  size: 'lg',
                                  text: user.gender ? (user.gender === 'ชาย' ? '♂' : '♀') : '[เพศ]',
                                  align: 'center',
                                  contents: []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              backgroundColor: colors.color_primary_1.color,
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  text: user.age ? `อายุ ${user.age.amount} ${en_th_unit_mapping(user.age.unit)}` : '[อายุ]',
                                  flex: 1,
                                  align: 'center',
                                  contents: []
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              backgroundColor: colors.color_primary_2.color,
                              cornerRadius: '5px',
                              action: postbackFilledIn({text: KEYS.editNickname, filledInText: user.nickname}).action,
                              contents: [
                                {
                                  type: 'text',
                                  text: user.nickname ? `ชื่อเล่น "${user.nickname}"` : '[แก้ไขชื่อเล่น]',
                                  flex: 2,
                                  align: 'start',
                                  offsetStart: '5px',
                                  style: 'italic',
                                  contents: []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          paddingTop: '5px',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              paddingAll: '2px',
                              backgroundColor: colors.color_primary_1.color,
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  size: 'sm',
                                  text: user.rtafunit || '[สังกัด]',
                                  align: 'start',
                                  wrap: true,
                                  contents: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'horizontal',
                  spacing: 'md',
                  paddingAll: '10px',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'message',
                        label: '⟲',
                        text: 'ดูโปรไฟล์'
                      },flex: 1,
                      color: '#FFFFFF3A',
                      height: 'sm',
                      style: 'primary'
                    },
                    {
                      type: 'button',
                      action: postbackFilledIn({text: 'แก้ไขโปรไฟล์',label: 'แก้ไข', filledInText: [
                        [user.rank, ...Object.values(user.person)].join(""),
                        user.age ? 'อายุ ' + user.age.amount + ` ${en_th_unit_mapping(user.age.unit)}` : 'อายุ   ปี',
                        `สังกัด ${user.rtafunit || ' '} ${user.gender ? (user.gender === 'ชาย' ? 'เพศชาย' : user.gender === 'หญิง' ? 'เพศหญิง' : 'ไม่ระบุเพศ'): ''}` // 
                    ].join("\n")}).action,
                      flex: 2,
                      color: '#FEFDFD84',
                      height: 'sm',
                      style: 'secondary'
                    },{
                        type: 'button',
                        action: postbackToggleRichmenu({text:'เมนู', label: '⏏', displayingText: true}).action,
                        flex: 1,
                        color: '#FFFFFF3A',
                        height: 'sm',
                        style: 'primary'
                      }

                  ]
                },
                styles: {
                  header: {
                    backgroundColor: colors.color_primary_0.color
                  },
                  hero: {
                    backgroundColor: colors.color_primary_0.color
                  },
                  body: {
                    backgroundColor: colors.color_primary_0.color,
                    separator: false
                  },
                  footer: {
                    backgroundColor: colors.color_primary_0.color,
                    separator: false
                  }
                }
              }


        }
    }

    youtubeThumbnails (url) {
      let id = getUrlParameter(url.substring(url.indexOf('?')), 'v')
      return [0, 1, 2 ,3].map(index => `https://img.youtube.com/vi/${id}/${index}.jpg`) 
    }

    youtubeBubble(media) {

      return {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  action: {
                    type: 'uri',
                    label: 'ชมคลิป',
                    uri: 'https://liff.line.me/1657366443-8gLpP5oa/?youtubeId=' + getUrlParameter(media.url.substring(media.url.indexOf('?')), 'v')
                  },
                  contents: [
                    {
                      type: 'image',
                      url: this.youtubeThumbnails(media.url)[0],
                      size: 'full',
                      aspectRatio: '4:3',
                      aspectMode: 'cover'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'image',
                          url: 'https://www.fiveminutefolklore.com/wp-content/uploads/2017/10/youtube-play-button-transparent-png-15-300x300.png'
                        },
                        {
                          type: 'filler'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'text',
              text: media.displayTitle || media.title,
              weight: 'bold',
              size: 'md',
              wrap: true,
              contents: []
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: 'ชมคลิป',
                uri: media.url
              },
              color: '#297C30FF',
              style: 'primary'
            }
          ]
        }
      }
      
      
      

    }

    /**
     *
     * @param {Array} media
     */

    mediaCarousel(media) {
      return {
        type : 'flex',
        altText : 'วิดีโอ',
        contents : {
          type: 'carousel',
          contents: media.slice(0, 10).map(m => this.youtubeBubble(m))
        }
        
      }
    }
}

module.exports = Payload