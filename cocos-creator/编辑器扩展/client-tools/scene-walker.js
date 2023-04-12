module.exports = {
  'checkAssetPathByUuid': function (event, ...args) {
    console.log('checkAssetPathByUuid')
    let uuid = args[0]

    Editor.log(`uuid : ${uuid}`)

    if (event.reply) {
      event.reply(null, "111")
    }
  }
}
