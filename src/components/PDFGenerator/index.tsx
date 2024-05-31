import { BsFileEarmarkPdfFill } from 'react-icons/bs'
import jsPDFInvoiceTemplate, { OutputType, type jsPDF } from 'jspdf-invoice-template'
import { toast } from 'sonner'

interface PDFGeneratorProps {
  fileName: string
  contactLabel: string
  contactName: string
  invoiceHeader: Array<{ title: string, style: { width: number } }>
  invoiceTable: Array<Array<string | number>>
  orientationLandscape: boolean
}

export const PDFGenerator = ({ fileName, contactLabel, contactName, invoiceHeader, invoiceTable, orientationLandscape }: PDFGeneratorProps) => {
  const getProps = () => {
    return {
      outputType: OutputType.Save,
      onJsPDFDocCreation: (jsPDFDoc: jsPDF) => { console.log(jsPDFDoc) },
      returnJsPDFDocObject: true,
      fileName,
      orientationLandscape,
      compress: true,
      logo: {
        src: 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1717022852/svgs/LOGO-LUNCHFIP-LIGHT_mviq4a.png',
        type: 'PNG', // optional, when src= data:uri (nodejs case)
        width: 70, // aspect ratio = width/height
        height: 18,
        margin: {
          top: 0, // negative or positive num, from the current position
          left: 0 // negative or positive num, from the current position
        }
      },
      stamp: {
        inAllPages: true, // by default = false, just in the last page
        src: 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1717184960/svgs/lunchfip-code-qr_vyqlym.png',
        type: 'JPG', // optional, when src= data:uri (nodejs case)
        width: 20, // aspect ratio = width/height
        height: 20,
        margin: {
          top: 0, // negative or positive num, from the current position
          left: 0 // negative or positive num, from the current position
        }
      },
      business: {
        name: 'LUNCHFIP',
        address: 'Cra. 1ª #18, El Espinal, Tolima',
        phone: '(+57) 315 3090045',
        email: 'team@lunchfip.online',
        email_1: 'rquimbaya39@itfip.edu.co',
        website: 'www.lunchfip.online'
      },
      contact: {
        label: contactLabel,
        name: contactName,
        address: '',
        phone: '',
        email: '',
        otherInfo: ''
      },
      invoice: {
        label: '',
        num: undefined,
        invDate: '',
        invGenDate: '',
        headerBorder: false,
        tableBodyBorder: false,
        header: invoiceHeader,
        table: invoiceTable,
        additionalRows: [],
        invDescLabel: '',
        invDesc: ''
      },
      footer: {
        text: 'Gracias por confiar en LunchFip, no dudes en contactarnos por cualquier inquietud.',
        style: {
          fontSize: 8,
          alignment: 'center'
        }
      },
      pageEnable: true,
      pageLabel: 'Page '
    }
  }

  const generatePDF = () => {
    toast('¿Deseas descargar el PDF con el registro completo?', {
      action: {
        label: 'Descargar',
        onClick: () => {
          const props = getProps()
          jsPDFInvoiceTemplate(props)
        }
      }
    })
  }

  return (
    <button className='flex justify-center items-center transition-all text-4xl text-red-600 hover:text-red-500 hover:scale-85' onClick={generatePDF}>
      <BsFileEarmarkPdfFill />
    </button>
  )
}
