import "draft-js/dist/Draft.css"
import "flatpickr/dist/themes/material_green.css"
import "megadraft/dist/css/megadraft.css"
import "react-toastify/dist/ReactToastify.css"
import { PageProvider } from "../context/PageContext"
import "../styles/globals.css"
import "../styles/iconuploader.css"
import "../styles/table.css"
import "../styles/utils.css"
import "../styles/forms.css"

function MyApp({ Component, pageProps }: any) {
  return (
    <PageProvider>
      <Component {...pageProps} />
    </PageProvider>
  )
}

export default MyApp
