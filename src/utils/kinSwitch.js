

export const kinSwitch = async () => {
  try {

    document.cookie = 'selectedKin=; Max-Age=0; Path=/'

    window.location.href = '/kindred'
  } catch (error) {
    console.error('Error during kin switch:', error)
  }
}
