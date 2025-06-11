let currentLanguage = 'en';

const translations = {
  en: {
    section1_title: 'Reporting Entity Details',
    section2_title: 'Report Metadata',
    section3_title: 'Related Reports',
    section4_title: 'Involved Entities',
    section5_title: 'Associated Accounts',
    sourceId_label: 'Reporting Entity ID',
    sourceName_label: 'Reporting Entity Name',
    branchId_label: 'Branch ID',
    reporter_title: 'Reporting Person',
    firstName_label: 'First Name',
    lastName_label: 'Last Name',
    phone_label: 'Phone',
    email_label: 'Email',
    reporterRole_label: 'Role',
    reportNumber_label: 'Report Number',
    reportDate_label: 'Report Date',
    reportStatus_label: 'Report Status',
    add_related: 'Add Related Report',
    add_person: 'Add Person',
    add_corporate: 'Add Corporate',
    add_account: 'Add Account',
    validate_button: 'Validate XML',
    download_xml: 'Download XML',
    download_pdf: 'Download PDF',
    reset_button: 'Reset'
  },
  he: {
    section1_title: '\u05e4\u05e8\u05d8\u05d9 \u05d4\u05d2\u05d5\u05e8\u05dd \u05d4\u05de\u05d3\u05d5\u05d5\u05d7',
    section2_title: '\u05de\u05d9\u05d3\u05e2 \u05d4\u05d3\u05d5\u05d7',
    section3_title: '\u05d3\u05d5\u05d7\u05d5\u05ea \u05e7\u05d5\u05d3\u05de\u05d5\u05ea',
    section4_title: '\u05d2\u05d5\u05e8\u05de\u05d9\u05dd \u05de\u05d5\u05e2\u05d1\u05d9\u05dd',
    section5_title: '\u05d7\u05e9\u05d1\u05d5\u05e0\u05d5\u05ea',
    sourceId_label: '\u05de\u05e1\u05e4\u05e8 \u05d2\u05d5\u05e8\u05dd',
    sourceName_label: '\u05e9\u05dd \u05d4\u05d2\u05d5\u05e8\u05dd',
    branchId_label: '\u05e1\u05e0\u05d9\u05e3 \u05e1\u05e0\u05d9\u05e3',
    reporter_title: '\u05de\u05d3\u05d5\u05d5\u05d7 \u05de\u05e1\u05d5\u05e8',
    firstName_label: '\u05e9\u05dd \u05e4\u05e8\u05d8\u05d9',
    lastName_label: '\u05e9\u05dd \u05de\u05e9\u05e4\u05d7',
    phone_label: '\u05d8\u05dc\u05e4\u05d5\u05df',
    email_label: '\u05d0\u05d9\u05de\u05d9\u05d9\u05dc',
    reporterRole_label: '\u05ea\u05e4\u05e7\u05d9\u05d3\u05d4',
    reportNumber_label: '\u05de\u05e1\u05e4\u05e8 \u05d3\u05d5\u05d7',
    reportDate_label: '\u05ea\u05d0\u05e8\u05d9\u05da \u05d3\u05d5\u05d7',
    reportStatus_label: '\u05e1\u05d9\u05d5\u05d5\u05d9 \u05d4\u05d3\u05d5\u05d7',
    add_related: '\u05d4\u05d5\u05e1\u05e3 \u05d3\u05d5\u05d7 \u05e7\u05d5\u05d3\u05dd',
    add_person: '\u05d4\u05d5\u05e1\u05e3 \u05d0\u05d9\u05e9',
    add_corporate: '\u05d4\u05d5\u05e1\u05e3 \u05d7\u05d1\u05e8\u05d4',
    add_account: '\u05d4\u05d5\u05e1\u05e3 \u05d7\u05e9\u05d1\u05d5\u05df',
    validate_button: '\u05d1\u05d3\u05d9\u05e7\u05ea \u05ea\u05e7\u05d9\u05e0\u05d5\u05ea',
    download_xml: '\u05d4\u05d5\u05e8\u05d3 XML',
    download_pdf: 'PDF \u05e9\u05dc \u05ea\u05e7\u05d9\u05e0\u05d5\u05ea',
    reset_button: '\u05d0\u05e4\u05e1'
  }
};

function switchLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang][key]) elem.textContent = translations[lang][key];
  });
}

function addRelatedReport() {
  const container = document.getElementById('relatedContainer');
  const div = document.createElement('div');
  div.className = 'relatedReportEntry';
  div.innerHTML = `<input class="relatedNumber" placeholder="Report Number" required>
    <select class="relationType">
      <option value="2">Supplement</option>
      <option value="3">Continuation</option>
      <option value="7">Related</option>
    </select>`;
  container.appendChild(div);
}

function addPerson() {
  const container = document.getElementById('entitiesContainer');
  const div = document.createElement('div');
  div.className = 'personEntry';
  div.innerHTML = `<h4>Person</h4>
    <input class="firstName" placeholder="First Name" required>
    <input class="lastName" placeholder="Last Name" required>
    <input class="idNumber" placeholder="ID Number">
    <button type="button" onclick="this.parentNode.remove()">Remove</button>`;
  container.appendChild(div);
}

function addCorporate() {
  const container = document.getElementById('entitiesContainer');
  const div = document.createElement('div');
  div.className = 'corporateEntry';
  div.innerHTML = `<h4>Corporate</h4>
    <input class="name" placeholder="Name" required>
    <input class="idNumber" placeholder="Registration Number">
    <button type="button" onclick="this.parentNode.remove()">Remove</button>`;
  container.appendChild(div);
}

function addAccount() {
  const container = document.getElementById('accountsContainer');
  const div = document.createElement('div');
  div.className = 'accountEntry';
  div.innerHTML = `<input class="accountNumber" placeholder="Account Number" required>
    <input class="financialInstID" placeholder="Institution ID">
    <input class="financialInstCountry" placeholder="Country" required>
    <select class="accountRelationType">
      <option value="1">Subject</option>
      <option value="2">Related</option>
      <option value="4">Counterparty</option>
      <option value="5">Pledged</option>
      <option value="6">Other</option>
    </select>
    <button type="button" onclick="this.parentNode.remove()">Remove</button>`;
  container.appendChild(div);
}

function loadXmlToForm(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const ir = xmlDoc.getElementsByTagName('IrRegularReport')[0];
    if (!ir) return;
    const src = ir.getElementsByTagName('IrRegularSourceMetaData')[0];
    if (src) {
      document.getElementById('sourceId').value = src.getElementsByTagName('SourceId')[0]?.textContent || '';
      document.getElementById('sourceName').value = src.getElementsByTagName('SourceName')[0]?.textContent || '';
      document.getElementById('branchId').value = src.getElementsByTagName('BranchId')[0]?.textContent || '';
    }
    const meta = ir.getElementsByTagName('ReportMetaData')[0];
    if (meta) {
      document.getElementById('reportNumber').value = meta.getElementsByTagName('ReportNumber')[0]?.textContent || '';
      document.getElementById('reportDate').value = meta.getElementsByTagName('ReportDate')[0]?.textContent || '';
      document.getElementById('reportStatus').value = meta.getElementsByTagName('ReportStatus')[0]?.textContent || '1';
    }
  } catch(e) {
    alert('Failed to parse XML');
  }
}

document.getElementById('xmlFileInput').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => loadXmlToForm(e.target.result);
  reader.readAsText(file);
});

function generateXmlString() {
  const impl = document.implementation;
  const xmlDoc = impl.createDocument(null, 'IrRegularReport', null);
  const ir = xmlDoc.documentElement;
  const src = xmlDoc.createElement('IrRegularSourceMetaData');
  ['SourceId','SourceName','BranchId'].forEach(id=>{
    const el = xmlDoc.createElement(id);
    el.textContent = document.getElementById(id.toLowerCase()).value;
    src.appendChild(el);
  });
  ir.appendChild(src);
  const meta = xmlDoc.createElement('ReportMetaData');
  const numEl = xmlDoc.createElement('ReportNumber');
  numEl.textContent = document.getElementById('reportNumber').value;
  meta.appendChild(numEl);
  const dateEl = xmlDoc.createElement('ReportDate');
  dateEl.textContent = document.getElementById('reportDate').value;
  meta.appendChild(dateEl);
  const statusEl = xmlDoc.createElement('ReportStatus');
  statusEl.textContent = document.getElementById('reportStatus').value;
  meta.appendChild(statusEl);
  ir.appendChild(meta);
  const serializer = new XMLSerializer();
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(xmlDoc);
}

function downloadXml() {
  const xml = generateXmlString();
  const blob = new Blob([xml], {type:'application/xml'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'IrRegularReport.xml';
  link.click();
  URL.revokeObjectURL(link.href);
}

function validateXml() {
  alert('Validation placeholder');
}

function downloadPdfSummary() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Irregular Report Summary', 10, 10);
  doc.save('IrregularReportSummary.pdf');
}
