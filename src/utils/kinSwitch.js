import { removeSelectedKin } from "@/app/lib/kinCookies"

export const kinSwitch = async () => {
  try {

    removeSelectedKin()
    window.location.assign('/kindred')
  } catch (error) {
    console.error('Error during kin switch:', error)
  }
}
