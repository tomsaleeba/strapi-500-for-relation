'use strict'

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  const permOrm = strapi.query('permission', 'users-permissions')
  const perms = await permOrm.find({ _limit: -1 })
  for (const curr of perms) {
    permOrm.update({ id: curr.id }, { ...curr, enabled: true })
  }
  // await doTest() // uncomment to see validation working correctly
}

async function doTest() {
  const employeeOrm = strapi.query('employee')
  await employeeOrm.create({
    name: 'blah',
    department: '99a',
  })
}
