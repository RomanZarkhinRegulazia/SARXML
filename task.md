@ Prompt Archive; 11/07/2025 ChatGPT 4o

<!-- I want to create a local web-based form that reads, edits and creates xml + pdfs. it should have an English/Hebrew toggle, 5 sections with different questions and fields the user needs to fill. at the end the form should do validation against 3 .xsd files (common, enumerations and irregularReport.

study the specifications and run additional validation to make sure you understand the specifications properly. after you finish, create a final task.md I can run on Codex to create such form. -->

<!-- Thanks for providing the documentation. To proceed with creating a task file for Codex that builds your local web-based form with XML/PDF support, I need to confirm a few details:

1. Should the form allow users to upload existing XML/PDF files for editing, or only generate new ones?
2. What technology stack would you prefer (e.g. HTML/CSS + vanilla JS, React, Vue, Flask backend, etc.)?
3. For the bilingual toggle (English/Hebrew), do you have preferred labels/translations, or should I use automatic translations?
4. Will the form be browser-only (i.e. run entirely in the browser), or is a backend component needed for PDF/XML handling and validation?
5. Should the final XML be validated on the client or server side?

Once I have this information, I’ll generate a complete `task.md` to create your form. -->

<!-- 1. upload existing XML only
2. the one that fits the task the most
3. use automatic translation
4. keep this as simple as possible, if a backend local bin folder should support the form - let it be
5. everything should happen on the client-side, he will download all necessary files from a .zip on my company's website -->

<!-- Great. I will prepare a Codex-compatible `task.md` for a simple local web-based form that:

* Reads and parses existing XML files.
* Allows editing of five structured form sections according to the specifications.
* Creates and downloads a final XML and a user-readable PDF.
* Validates the final XML against three XSD files (common.xsd, enumerations.xsd, and irregularReport.xsd).
* Supports English/Hebrew toggling via automatic translation.
* Works fully client-side, with static JS and a downloadable support ZIP.

I’ll make sure the generated form and validation logic comply with the official schema and business logic from the provided documents. I’ll get back to you with the final `task.md` shortly.
 -->

# Local Web-Based Irregular Report Form (IrregularReport) Specification

## Key Features and Overview

* **XML Upload & Parsing**: Users can upload an existing **IrregularReport XML** file. The app will parse this XML (using browser APIs like `FileReader` and `DOMParser`) into the form fields for review and editing. This ensures that users can start from a pre-existing report structure.

* **Editable Sections**: The form is divided into **five sections** reflecting the IrregularReport structure:

  1. **Reporting Entity Details** – Information about the reporting institution and the report submitter.
  2. **Report Metadata** – General report info (type, date, status, etc.).
  3. **Related Reports** – References to any previous reports related to this one.
  4. **Involved Entities** – Details of people and organizations involved in the reported event.
  5. **Associated Accounts** – Information on relevant accounts (bank accounts, digital wallets, etc.) associated with the report.

* **Two-Way Language Support (Hebrew/English)**: The UI supports bilingual display. Users can toggle between **Hebrew** and **English** at any time. All labels, instructions, and static text will automatically switch language. The translation is handled client-side via a predefined dictionary (no server calls needed). *Note:* The content that users input (e.g. names, descriptions) will not be automatically translated; only the interface text and section labels switch language.

* **Client-Side Validation (XML & Business Rules)**: The app performs validation on two levels:

  * **Form Field Validation**: Each section enforces mandatory fields, allowed formats, and inter-field dependencies based on the business rules and XSD constraints (e.g. required codes, proper date formats, etc.). Validation messages are shown in context (e.g. beneath the field or at the section) in the current language.
  * **XML Schema Validation**: Upon completion, users can validate the composed XML against the provided XML Schemas (**XSDs**). The three schema files – `common.xsd`, `enumerations.xsd`, and `irregularReport.xsd` – are included locally. The app uses a WebAssembly-powered XML validator (based on libxml2) to ensure the final XML conforms to the schema. This runs entirely in the browser (via a Web Worker) for fast, offline validation.

* **Output Generation**: Users can generate two outputs after filling the form:

  * **Final XML File**: The app constructs an XML document matching the IrregularReport format with the edited data. Users can download this XML (packaged in a ZIP if needed by regulations). The XML generation logic ensures the output is schema-compliant (matching element names, structure, and required values).
  * **PDF Summary**: The app can generate a PDF report summarizing all entered data in the **selected language**. This uses a lightweight JS library (e.g. **jsPDF**) to compile the form data into a readable PDF document, with section headings and field labels in the chosen language. The PDF can be downloaded with a single click.

* **100% Client-Side Implementation**: The form is built with **HTML, CSS, and vanilla JavaScript** only – no server interactions. All necessary resources (schemas, scripts, etc.) are loaded locally. This means the tool can run offline in a web browser. For XML schema validation, an optional WebAssembly module is used to perform XSD validation in-browser for accuracy. The XSD files and any JS libraries (e.g. jsPDF, validation WASM) are bundled so that the entire tool can be delivered as a single ZIP and run locally without external dependencies.

The following sections detail the form’s design and implementation for each of these features.

## Form Sections and Data Structure

The form is organized into five main sections, mirroring the IrregularReport XML structure. Each section groups related fields and provides inline validation per the XSD and business rules. All field labels and options will be available in both Hebrew and English, with the ability to toggle language at any time.

### 1. Reporting Entity Details (Source Metadata)

This section captures information about the reporting financial institution and the person submitting the report. It corresponds to the XML element `IrRegularSourceMetaData`. Key fields include:

* **Source Type** – Type of the reporting entity. This will be a fixed code in this context (for a financial service provider, the code is `7`). The form can auto-fill this value as it’s constant (e.g. hidden or read-only input set to "7" for FSP).
  *Constraint:* Must match the expected code per the XSD (here "7" indicates a financial services provider).

* **Source ID** – The unique identifier of the reporting entity (e.g. institution registration number). This is required and should exactly match the number used in the naming of the report ZIP file. The form will validate this as a numeric or alphanumeric code as per the documentation.

* **Source Name** – The name of the reporting entity (institution name). This is a required text field.

* **Branch ID** – The branch number of the reporting entity’s office submitting the report. Required numeric field. This value also appears in the expected ZIP filename, so the form may cross-check it with the Source ID in the file name if an XML was uploaded.

* **Reporting Person Details** – Information about the individual who prepared/submitted the report on behalf of the institution. This is a nested group of fields:

  * **First Name** (required) and **Last Name** (required) of the reporting person.
  * **Phone Number** (required) – Contact phone for the reporter. Only one phone is allowed. The expected format includes country/area codes and can include separators (the form will enforce a pattern or use an input mask).
  * **Email Address** (optional) – Contact email for the reporter. Only one email can be provided, and it should be in a valid email format (`x@y.zz` as per guidelines).
  * **Reporter Role/Title** (required) – The role or job title of the reporting person (free text).
  * **Reporter ID Type** (required) – The type of identification for the reporting person. This is a coded field (e.g. 1 for Israeli ID card, 2 for passport, etc.) with an accompanying description if needed. For example, code **1 corresponds to Teudat Zehut (Israeli ID card)**. The form will provide a dropdown of ID types (populated from the enumerations schema) and if “Other” is selected, a description must be entered.
  * **Reporter ID Number** (required) – The ID number corresponding to the selected ID type (format validation can be applied, e.g. Israeli ID 9 digits if type is 1).
  * **ID Issuing Country** (required) – Country that issued the ID (dropdown of country codes from `enumerations.xsd`, using ISO country codes). If the reporting person’s ID is domestic, this would be "IL" for Israel, otherwise another country code.

  *Dynamic Rules:* If an **“Other”** ID type is chosen, an additional field **ID Type Description** becomes required to describe the ID type. Similarly, any optional fields not filled will not break form submission but the XSD validation will ensure required ones are present.

All fields in this section are validated as per XSD constraints and business logic. For example, Source Type/ID/Branch are mandatory and numeric, the phone must be a valid format, and email (if provided) must match an email pattern. This section’s data maps to the XML under `<IrRegularSourceMetaData>` in the final output.

### 2. Report Metadata

This section covers high-level metadata about the report itself, corresponding to the XML `ReportMetaData` element (and some root-level attributes). It includes:

* **Report Type** – A code indicating the type of report. For an Irregular (Unusual Activity) Report, this is a constant **“2”** (meaning “Irregular Report”). The form will set this automatically (read-only field or hidden input) because all reports here are of this type.

* **Report Classification** – Security classification level of the report. Per the spec, this is a constant **“10”** (representing “Most Confidential”). This will also be fixed in the form (pre-filled with 10).

* **Version** – Schema version of the report format. The initial version is **“1.0”**. This is pre-set to "1.0" (and can be hidden or read-only since it shouldn’t be changed by the user).

* **Report Number** – A unique sequential identifier for this report. This is required and must be unique for each report sent by the entity. The number will also appear in the output ZIP file name. The form will ensure this is provided (and numeric). If an XML is uploaded, this field will be populated from the file.

* **Report Date** – The date the report was written. Format is `YYYY-MM-DD` and it **must reflect the day the report is being submitted**. The value must match the 'report date' part of the ZIP file name (the XML uses dashes in the date, whereas the file name might omit them). The form uses a date picker constrained to valid dates. By default it can initialize to today’s date for convenience.

* **Report Description** – A free-text description of the report or the software used. According to guidance, this field should note the software/tool used to generate the report and its version/date. For example, the application could autofill this with something like *“Generated via IrregularReport Web Form v1.0 on YYYY-MM-DD”*, which the user can edit. This field is not strictly required by XSD (no asterisk noted), but it is recommended to provide this info.

* **Report Status** – Indicates if this report is new or linked to previous report(s). It’s an enumerated code:

  * **1 – New Report** (default for a standalone report).
  * **2 – Supplement to a previously sent report**.
  * **3 – Continuation of a previously sent report**.
  * **4 – Related to a previously sent report**.
    The form will present these options in a dropdown (with descriptive labels). If a status other than “New” is chosen (2, 3, or 4), the form will require specifying at least one **Related Report** in section 3 (see next) – specifically, the Report Number of the earlier report that this one supplements/continues/relates to. The UI can enforce this by disabling submission until a related report is provided in that case, and by showing a prompt in the Related Reports section.

All fields in Report Metadata are validated: Report Date must be a valid date (and not in the future, possibly), Report Number must be provided and unique, and the dependencies like Status vs Related Reports are checked. This section maps to `<ReportMetaData>` in the XML (with Version being a direct child of the root `<IrRegularReport>`).

### 3. Related Reports

If this report has any preceding reports to which it is linked (as per **Report Status** above), they are listed here. This section corresponds to the XML element `RelatedReports` (which can contain one or more `RelatedReport` entries). Users can add **one or multiple related report references** (or none, if the report is new and unrelated).

For each related report entry, the following fields are provided:

* **Previous Report Number** – The identifier of the earlier report that is related to this one. This is the same kind of number as in “Report Number” above. The user enters the number of the report previously sent to the authorities that relates to the current report. (If multiple, each gets its own entry.) This field is required for each related report item.

* **Relation Type** – The nature of the relation of this report to the previous one. This is an enumerated code describing how the reports are connected:

  * **2 – Supplement to a previous report** (this current report provides additional info to the earlier report).
  * **3 – Continuation of a previous report** (a follow-up report continuing the earlier one).
  * **7 – Related to a previous report** (some other kind of linkage to the earlier report, not strictly a supplement/continuation).
    (These codes correspond to the Report Status choices 2, 3, and 4 respectively, but note the code “7” is used here for a general related link). The form will show a dropdown for relation type. If the user selected “Supplement” as the Report Status, the logical choice here would be 2, etc., but we will not hard-restrict it in case multiple relations need to be noted. The UI can allow multiple relation types if needed (the schema allows multiple `<Relation>` entries per related report).

If the user indicates a non-new Report Status, at least one Related Report entry must be provided (the interface can enforce this with an alert or by marking this section incomplete until filled, per the rule ). Conversely, if the status is “New”, this section can be left empty (and the XML will omit `RelatedReports` or leave it empty as allowed). The application will allow adding additional rows for multiple related reports (with an “Add another related report” button). Each entry will be validated to ensure the report number is numeric and the relation type is selected.

**Example:** If *Report Status* is set to “2 – Supplement”, the user might add a Related Report with number “20210045” and relation type “2 – Supplement to previous report” to indicate this report supplements report #20210045.

### 4. Involved Entities (People and Corporates)

This section captures details of all **entities (individuals or organizations)** involved in the unusual activity being reported. It corresponds to the XML `ListOfInvolvedEntities`, which contains two sub-lists: `Persons` and `Corporates`. The form will allow the user to add any number of persons or corporates as involved entities. Each entity entry includes comprehensive identification and background details as defined in the Common XSD components for Person and Corporate.

The form UI may separate this into two subtabs or subsections – **Individuals** and **Organizations** – for clarity. The user can choose to add a “New Person” or “New Corporate Entity” and a dedicated subform will appear for each, with fields as below.

#### Involved Person Details

For each person involved, the following fields are collected (many align with a personal KYC profile):

* **Last Name** – The person’s surname. **Required** for individuals. (Not applicable for corporates; for a corporate, the Name field is used instead, as described later.) If the person has only one name, it can be repeated or the same in first name field as needed.

* **First Name** – The person’s given name. **Required**. (Not filled for entities that are corporates.)

* **Name in Latin Characters** – If the person’s name (first name or full name) is in a non-Latin script (e.g. Hebrew, Arabic), a transliteration to Latin characters can be provided. The form offers fields for **First Name (Latin)** and **Last Name (Latin)**. These are optional (not mandatory per XSD), but they are recommended if applicable. The form will hide these for corporate entries (LatinName is used for corporate name as well, see below).

* **Date of Birth** – The person’s birth date. **Required** in format `YYYY-MM-DD`. A date picker ensures correct format. This field is only for individuals; for a corporate, the analogous field is *Foundation Date*.

* **Gender** – The person’s gender. **Required** as a code. Options are:

  * 1 – Male
  * 2 – Female
  * 99 – Other/Not Applicable
    The form provides these choices (likely in the user’s language, e.g. “Male, Female, Other”). If “Other” (99) is selected, an **Gender Description** text field becomes mandatory to describe the gender (e.g. for non-binary or unspecified, as required by the regulation). This description corresponds to `EntityGenderDesc` in the XML.

* **Residence Status** – The residency or legal status of the person in terms of domestic/foreign. **Required code** with options such as:

  * 1 – Resident (local citizen/resident)
  * 2 – Foreign Resident
  * 5 – Other (e.g. special cases like asylum seeker)
  * 6 – Resident of Area (e.g. territories)
    (Codes 3,4,7 apply to corporates – see below – but the schema uses the same field for both). The form will show relevant options for a person (1,2,5,6, etc.) and for a corporate (3,4,5,7, etc.), or show all with not-applicable ones disabled based on type. If **“Other” (code 5)** is selected, an **Residence Status Description** must be provided (field for free text, e.g. “asylum seeker, workers’ committee, etc.” as noted). This covers cases not in standard categories.

* **Personal ID Details** – The identification document for the person (similar to reporter’s ID):

  * **ID Type** – code for type of ID (e.g. national ID, passport, driver’s license, etc., with an “Other” option). This is a dropdown populated from the enumerations (likely the same list as for the reporting person). If "Other" is selected, **ID Type Description** is required (to describe the ID).
  * **ID Number** – the identifier number on that document. Required if ID Type is provided.
  * **ID Issuing Country** – ISO country code for the country that issued this ID. Required (even for local ID, "IL" would be used).

  These fields (ID Type, Number, Country, and optional description) are all part of the Person’s identification. The form ensures if an ID Type is chosen, all parts are properly filled and consistent. For example, if ID Type = 1 (Israeli ID), it could enforce a 9-digit format; if ID Type = 2 (Passport), it might allow alphanumeric.

* **Occupation** – The occupation or business of the person. The schema expects an occupation code from an official classification (the “Standard Classification of Occupations”). The user should provide a 4-digit **Profession Code** if known. The form can include a tooltip/link to the CBS occupation table for reference. If the appropriate code is not available or the data is not maintained in that way, the instructions are to use the code "xxxx" and then provide an **Occupation Description** in a free text field. In practice, the form will have:

  * **Occupation Code** – text input for the 4-character code (or "xxxx" if unknown).
  * **Occupation (Other) Description** – text input that is required if the code is "xxxx" (or some placeholder indicating unknown).
    These fields are only for individuals (for corporates, a different field for business sector is used).

* **Addresses** – One or more addresses for the person. The form allows adding multiple addresses if needed (the XSD allows more than one address per entity). Each address includes:

  * **Country** – Country of the address (ISO code dropdown). **Required** for each address (even if Israel).
  * **City** – The city/town. For addresses in Israel, the form should use an official city code list. If the country is Israel and the user can provide the **City Code**, they should (a reference to the government dataset could be provided). If the city code is unknown or not used, the user can enter a generic code "777777" to indicate unknown, and then must fill the **City Name** in a separate field. For foreign addresses, city name can be entered directly (and city code could be left blank or use "777777" convention as well). The form can simplify this by allowing a free-text city name always, but internally if country=IL, try to map or prompt for the code. To keep it simple, we may allow the user to either enter a City Code or a City Name. If City Code is "777777", then City Name becomes required (this rule is enforced by validation).
  * **Street** – The street name. Similar to city, Israel has an official **Street Code** system. If country is IL and street code is known, it can be entered; otherwise use "777777" and fill **Street Name** in an “Other Street” field. The form will have Street Code (optional) and Street Name. If Street Code is set to the placeholder (or left blank), Street Name is required. For foreign addresses, just the Street Name is used.
  * **House Number** – The building number. This is required if available (if an address doesn’t have a house number, a value like "N/A" or 0 could be used, but generally it should be provided). The form treats it as required numeric for each address.
  * **Postal Code** – There are two fields in the schema: **New ZIP Code** (7 digits, newer format) and **ZIP Code** (older 5-digit format). The documentation shows both marked as required. In practice, for an Israeli address, the 7-digit code is used; for foreign, it may not apply. We will include a single Postal Code field in the form for simplicity. The logic will be to place a 7-digit code in NewZIPCode if country is IL (and possibly duplicate or derive the 5-digit if needed), or use the ZIPCode field for foreign addresses. To the user, this is one **Postal Code** field (required). The app can handle mapping it to the correct XML element based on length or country. (If needed, it can fill both XML fields for Israeli addresses for compliance).

  Each address added is validated: country required, and if country is IL, the special code rules apply (the form can auto-set "777777" if the user types a custom city/street name). City/Street other-text fields are required if their code is unknown. These rules follow the guidelines (eventually, using official codes may become mandatory), but the tool accommodates current flexibility.

* **Contact Info for Person** – Similar to the reporter, for each person we can capture contact methods if available:

  * **Phone Number(s)** – The schema allows one or more phone numbers per person. The form lets the user add multiple phone entries. Each phone has a **Type** (dropdown: 1 – Landline, 2 – Fax, 3 – Mobile) and the **Number**. The format is the same as before (with country/city codes and separators allowed). We will enforce at least one phone if it’s relevant (though it may not be strictly required to have a phone for every involved person, the schema likely allows none; we will treat it as optional unless regulation says otherwise).
  * **Email Address(es)** – One or more email addresses can be recorded for the person. This is optional. The form can have an “Add Email” button. Each email must be in a valid format. (The XSD likely allows 0…\* email addresses for Person and Corporate.) We will not require it unless the business rules demand it (not indicated as required in documentation).

For each person added, the UI will group these fields (perhaps in an expandable/collapsible panel showing the person’s name once entered). Validation ensures all required sub-fields for that person are filled and consistent. For example, it will check that if an occupation code is given as "xxxx", then an occupation description is provided; or if Residence Status is "Other", the description field is filled; or if an Israeli address is given, that the city and street fields satisfy the code/name rules, etc.

#### Involved Corporate Entity Details

For each corporate entity (company, organization, etc.) involved, similar details are gathered, aligned with the `Corporate` element structure:

* **Name of Corporate** – The organization’s name. **Required** (equivalent to Last Name field for corporates). (On the form, we label this as “Organization Name”). If the name is not in Latin characters, the next field can capture a transliteration.

* **Name in Latin** – The corporate name in English/Latin characters, if the official name is in another language/script. Optional but recommended. This corresponds to `LatinName` for Corporate.

* **Foundation Date** – The date the company or organization was established/registered. **Required** (in `YYYY-MM-DD`) for corporates. This is analogous to Birth Date for individuals. The form will have a date picker for this.

* **Residence Status** – The legal status of the entity: e.g., **3 – Israeli Corporation**, **4 – Foreign Corporation**, **7 – Corporation of Area (territories)**, or **5 – Other** (for types like unincorporated associations, etc.). Required field. Options overlap with the person’s field but focus on corporate codes. If “Other (5)” is chosen, an **Other Status Description** must be provided (e.g. “House Committee, Workers’ Union”). The form will handle this similar to the person’s case.

* **Registration Details** – Identification of the corporate entity:

  * **Corporate ID Type** – A code for the type of registration identifier (e.g., 1 – Israeli Company Number, 2 – Foreign Company ID, etc., including an “Other”). The enumerations may define these. The form will provide a dropdown. If “Other”, a description field appears.
  * **Corporate ID Number** – The registration number/identifier of the entity (required alongside the type).
  * **ID Issuing Country** – Country that issued/under which the registration exists (e.g. "IL" if Israeli company, or another country code if foreign).
  * **ID Type Description** – If an uncommon ID type was used, description for it (only required if ID Type is “Other”).

  Essentially, these mirror the person’s ID fields, but for a company (for example, ID Type might differentiate between a company registration, charity registration, etc., if enumerations distinguishes them).

* **Business Field/Industry** – A description of the corporate’s line of business or field of activity. This is a free text field for the corporate’s sector. The documentation expects this *for corporates only*. It may be required to fill (likely yes, since there is no code given for corporates’ field in the snippet). The form will provide an **Industry/Field Description** textbox for corporates. (There is no standardized code list given for corporates in the IrregularReport context, so just a description is used. By contrast, for persons, we had the occupation code list.)

* **Addresses** – Same structure as for person: multiple addresses can be added. For each address of a corporate, the fields are Country, City (code or name), Street (code or name), House Number, Postal Code, etc., identical to the person address fields described above. The same validation rules apply (e.g., if Israel, use codes or "777777" with names; country is required; etc.). The form can reuse the same address component UI for both person and corporate.

* **Contact Info** – Corporates can also have contact numbers and emails:

  * **Phone Number(s)** – Multiple allowed, with type (1=Landline, 2=Fax, 3=Mobile). Likely at least one contact number for a company is expected but not strictly required by XSD. The form will allow adding phone entries, similarly to person.
  * **Email Address(es)** – Multiple allowed, optional. For instance, a general contact email or a specific address relevant to the case.

Each corporate entry will be validated just like person entries. For instance, Foundation Date must be provided, the Corporate ID fields must be consistent (if type given, number and country required), and so on. The form ensures fields not applicable to corporate (like first name, gender, occupation code) are disabled or hidden for corporate entries to avoid confusion (with notes like “Not applicable for organizations” as seen in the documentation).

**Linking Entities to the Event:** The IrregularReport schema includes how each involved entity is related to the reported event or account. In the XML, within each Person or Corporate, there is a `RelationsToEvent`/`Relation` structure that contains a `RelationTypeID` describing the entity’s role (e.g. account owner, beneficiary, suspect, etc.). Capturing this is important for context:

* We will include a field **Relation to Event** for each entity, as a dropdown of codes (the enumerations for RelationType in context of involved entities). For example, typical codes might be like 1 – “Subject of report (the one the report is about)”, 2 – “Related party”, etc. (These codes are defined similarly to accounts; for entities, possible values might include things like “suspect”, “associate”, but for simplicity we can mirror the account relation codes if applicable). If an “Other” relation is available and chosen, a description field will appear (RelationTypeDesc).
* If the documentation provides a specific list for entity relation, we would use that. However, since not explicitly listed in the prompt, we might use a generic approach or skip if unknown. Given the complexity, this may be optional to fill by the user unless mandated.

*(For reference, the schema segment for accounts shows sample RelationTypeIDs like 1 for “account of interest”, 2 for “related account”, etc.. For persons, it might be a different set such as 1 – “Primary subject”, 2 – “Associate”, 3 – “Not relevant”, 6 – “Other”, etc. The form design will accommodate a RelationType code for each entity if required.)*

All involved entities entered will be serialized under `<ListOfInvolvedEntities>` in the XML, separated into `<Person>` and `<Corporate>` elements as appropriate. The app will handle constructing these subtrees according to the data entered.

### 5. Associated Accounts

This section handles information on accounts related to the reported unusual activity. These can be bank accounts at the reporting institution, accounts at other institutions, or even digital wallet addresses, depending on the case. In the XML, there are two structures: `IrRegularAccounts` (for accounts at the same institution or local context) and `IrRegularOtherAccounts` (for accounts at foreign institutions or of types outside the normal local banking, like digital wallets). The form will present a unified interface for **Associated Accounts**, and internally decide where each account goes in the XML based on the details provided (e.g. an institution type or country).

For each account to be reported, the user will fill in:

* **Account Number** – The account identifier. This is required for any account entry. It could be a bank account number or wallet address, etc., depending on context. The form accepts alphanumeric input (with possible patterns for bank accounts if known). In the XML, this maps to `AccountNum` under either IrRegularAccount or IrRegularOtherAccount as appropriate.

* **Financial Institution Type** – A code indicating the type of financial institution where this account is held. **Required.** The enumerations for this might include:

  * 1 – Bank (standard banking institution)
  * 2 – (Possibly) Foreign bank
  * 3 – (Possibly) Other domestic institution (like credit union or other type)
  * 6 – Postal Bank (in Israel)
  * etc., including perhaps codes for digital wallet/exchange.
    The user selects from a dropdown. This code will determine how we treat other fields. For example, if type is "Bank" or "Postal Bank" within Israel, we expect to use local bank codes; if it's a foreign bank or a digital wallet, we'll treat it as an “OtherAccount”.

* **Financial Institution ID** – This is typically a numeric code identifying the institution. **Required** if applicable. For example, for `FinancialInstituteType = 1 (Bank)`, the user must provide the bank’s official code (in Israel, the 2-digit or 3-digit bank code). The documentation provides a list of bank codes (e.g., 10 for Leumi, 12 for Hapoalim, etc.). The form could present a dropdown of known bank codes if type=Bank, to help the user select the correct one (or at least a link to the list). For a foreign institution, this might not be applicable – in that case, the user might leave it blank or use a generic code. However, since `FinancialInstituteID` is required by XSD for IrRegularAccount (local), if the account is at a local bank we must have a code. If the account is at a foreign institution, we will be treating it as IrRegularOtherAccount (which likely does not require a numeric code in the same way, or might use SWIFT/BIC instead—if a SWIFT code is available, it could be put here or in name). The form logic: if Financial Institution Type corresponds to a known list (like Israeli bank or postal bank), then **Bank/Institution Code** is required. If it’s an institution abroad or a non-standard one, we might allow leaving the code field blank or using a placeholder like 9999, and rely on the Name field instead.

* **Financial Institution Name** – The name of the institution where the account is held. If the institution is foreign or not one of the coded ones, this becomes important. For local banks, this is optional (since the code identifies it). For a foreign institution or a digital platform, we require the name. The form will always allow entry of the name, and it will be required if an official code wasn’t provided. For example, if type=“Foreign Bank”, the user might input *“Bank of America, NY Branch”* here.

* **Institution Country** – The country where the financial institution is based/located. **Required** (ISO country code). For local Israeli banks, this would be "IL". For foreign accounts, it could be another country code. This maps to `FinancialInstituteCountry` in both account types. The form will ensure a country is selected for each account.

* **Branch ID / Name** – Details of the specific branch of the institution:

  * For accounts at local institutions (when FinInstType indicates a domestic bank or similar), a **Branch ID** (numeric code) is expected. E.g., branch number of the bank. The user should provide the branch code if known. (This is required in IrRegularAccounts entries).
  * For accounts at foreign institutions or others, a **Branch Name** can be provided instead (since a numeric code may not apply). E.g., “London Main Branch”. The form can have a single field that serves as "Branch ID/Name": if the institution country is IL, label it "Branch Number"; if not, label it "Branch Name". We will map it to the correct XML element (BranchID vs BranchName) based on context. If the user provides a numeric branch for a foreign bank, we might still treat it as BranchName text in XML.

* **Account Relation Type** – The relationship of this account to the event/report. **Required code.** This describes why the account is included:

  * **1 – Account of the subject of report** (the primary account under investigation).
  * **2 – Related account** (an account that is linked but not the main one).
  * **4 – Counterparty account** (e.g., the other side of a suspicious transaction).
  * **5 – Pledged account / used as collateral**.
  * **6 – Other** (if none of the above fits, then a description must be provided).
    The form provides a dropdown with these options (with descriptive text). If “Other” is selected, an **Account Relation Description** field appears for free text (mapped to `RelationTypeDesc` in XML). This ensures that if a non-standard relation is reported, it’s explained. Each account entry must have one relation type chosen.

By providing the relation type, the report clearly indicates each account’s role (e.g., which account was suspicious vs. which was just related). This is mandated in the schema as shown by the RelationTypeID under IrRegularAccount.

The form will allow adding multiple account entries. For each new account, the user fills the above fields. We will use dynamic behavior such as:

* If Financial Institution Type is set to a value indicating a local bank or postal bank, we can display a dropdown of known bank codes (or at least validate the code against allowed values for that type). If type indicates a foreign institution/digital, we can hide/disable the bank code field and require the institution name instead.
* The Branch field label can change based on country as noted.
* The relation type field is always required.

Validation for accounts:

* All required fields must be filled (account number, type, institution country, relation type, etc.).
* If type implies a code, ensure code is provided and is valid (we might cross-check that a numeric code was entered for local banks, possibly even validate its length or existence in the known list; e.g., Israeli bank codes are 2 or 3 digits, postal bank code is 9, etc. as given in enumerations).
* If “Other” relation is chosen, description is required.
* If any numeric fields are provided, they should be numeric (account number might be alphanumeric, so we allow that; but branch ID and institution ID should be numeric).
* The combination of Institution Type and Country might decide whether this goes to IrRegularAccounts or IrRegularOtherAccounts in XML. Likely: if Country is "IL" (and type is a known local type), use IrRegularAccounts; if Country is not IL or type is something like "digital wallet", use IrRegularOtherAccounts. The application can handle this mapping internally when generating XML.

This section’s data will be output under `<IrRegularAccounts>` for domestic accounts and `<IrRegularOtherAccounts>` for foreign/other accounts accordingly. The user does not need to worry about that detail; they just fill in the information, and the app will sort it out. The distinction is mentioned in the documentation: accounts in local institutions go under IrRegularAccounts, whereas accounts in a foreign institution or digital wallets go under IrRegularOtherAccounts.

## Client-Side Implementation Details

All functionality is implemented in the browser using standard web technologies. Below is an outline of how each major feature will be handled:

### HTML and CSS Structure

The application will consist of a single-page HTML file (e.g. `index.html`) that includes all form sections, and possibly some included scripts for libraries. The form might be structured with HTML `<fieldset>` or `<section>` elements for each of the five sections, with appropriate `<legend>` or `<h3>` headings for clarity. For example:

```html
<form id="irregularReportForm">
  <!-- Section 1: Reporting Entity Details -->
  <fieldset id="section-source">
    <legend>Reporting Entity Details</legend>
    <!-- Fields for SourceType, SourceID, SourceName, etc. -->
  </fieldset>

  <!-- Section 2: Report Metadata -->
  <fieldset id="section-metadata">
    <legend>Report Metadata</legend>
    <!-- Fields for ReportType, ReportClassification, ... Status -->
  </fieldset>

  <!-- Section 3: Related Reports -->
  <fieldset id="section-related">
    <legend>Related Reports</legend>
    <!-- Table or repeatable fields for related report entries -->
  </fieldset>

  <!-- Section 4: Involved Entities -->
  <fieldset id="section-entities">
    <legend>Involved Entities</legend>
    <!-- Subtabs or buttons to add Person/Corporate and containers for their subforms -->
  </fieldset>

  <!-- Section 5: Associated Accounts -->
  <fieldset id="section-accounts">
    <legend>Associated Accounts</legend>
    <!-- Repeatable fields for account entries -->
  </fieldset>

  <!-- Buttons for actions -->
  <div class="form-actions">
    <button type="button" id="btn-validate">Validate XML</button>
    <button type="button" id="btn-download-xml">Download XML</button>
    <button type="button" id="btn-download-pdf">Download PDF Summary</button>
    <button type="reset">Reset Form</button>
  </div>
</form>
```

We will also include a language toggle control at the top of the page, e.g. a switch or two buttons for English and Hebrew. For instance:

```html
<div id="languageToggle">
  <button type="button" onclick="switchLanguage('en')">English</button>
  <button type="button" onclick="switchLanguage('he')">עברית</button>
</div>
```

The HTML will be structured semantically, and CSS will be used to organize the layout (perhaps a multi-step form layout or a tabbed interface for the longer sections like Entities and Accounts). Each section will be clearly separated, and if needed, scrollable if there are many entries (for Entities/Accounts).

CSS will also handle styling for required field indicators (e.g. adding a red asterisk for labels of required fields), error message displays (like `.error-message { color: red; }` shown next to fields), and the direction alignment for languages (we will define `[dir="rtl"]` styles for Hebrew direction if toggled, see Multilingual support below).

### Multilingual Support (Hebrew/English Toggle)

The bilingual functionality is achieved via on-the-fly text swapping. We maintain a dictionary of all interface text in both languages. For example, a JavaScript object `translations` might look like:

```js
const translations = {
  en: {
    "section1_title": "Reporting Entity Details",
    "sourceId_label": "Reporting Entity ID",
    "firstName_label": "First Name",
    "firstName_placeholder": "Enter first name",
    "validate_button": "Validate XML",
    // ... and so on for every label, button text, and static message.
  },
  he: {
    "section1_title": "פרטי הגורם המדווח",
    "sourceId_label": "מספר גורם מדווח",
    "firstName_label": "שם פרטי",
    "firstName_placeholder": "הקלד שם פרטי",
    "validate_button": "בדיקת תקינות",
    // ... all corresponding Hebrew text.
  }
};
```

Each form label element in HTML will have an identifier (like `id` or a `data-i18n-key`) so that the script knows which text to replace. For instance:

```html
<label for="sourceId" data-i18n="sourceId_label">Reporting Entity ID</label>
<input type="text" id="sourceId" name="sourceId" required>
```

We use the `data-i18n` attribute to store the translation key. Similarly, placeholders for inputs can use the `data-i18n-placeholder` attribute if needed (or we handle them via script).

The `switchLanguage(lang)` JavaScript function will do something like:

```js
function switchLanguage(lang) {
  // Assume lang is 'en' or 'he'
  // Update text direction for Hebrew
  document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';

  // Find all elements with data-i18n and replace their textContent
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    if (translations[lang][key]) {
      elem.textContent = translations[lang][key];
    }
  });
  // Similarly update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
    const key = elem.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      elem.setAttribute("placeholder", translations[lang][key]);
    }
  });
  // Also update any button values or other attributes as needed.
}
```

When the user clicks the "English" or "עברית" button, this function is called, and all visible text switches language. The form fields that the user has already filled (like names, descriptions) remain unchanged (we do not translate user-entered data). The layout direction is toggled by setting `dir="rtl"` on the root for Hebrew, which will automatically right-align text and flip field ordering in most browsers. We’ll ensure in CSS that our form supports both LTR and RTL (for example, using flexbox or grid that can accommodate reversed direction, and aligning labels appropriately).

All validation messages and dynamic text will also utilize the translation system. For instance, an error like "This field is required" will be generated using a key (e.g. `error_required`) which has translations in both languages. This way the user always sees messages in the currently selected language.

By using a dictionary approach, adding new languages or adjusting wording is straightforward. There is no external translation API; everything is predefined, which is suitable since the terminology is specific (we want consistent regulatory terms rather than literal machine translation). This approach ensures the app works offline and instantly toggles languages.

### XML File Upload and Parsing

For uploading an existing IrregularReport XML, we will use an `<input type="file" accept=".xml">` element. When a user selects a file, the app will read it as text:

```js
document.getElementById('xmlFileInput').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const xmlContent = e.target.result;
    loadXmlToForm(xmlContent);
  };
  reader.readAsText(file);
});
```

In `loadXmlToForm(xmlContent)`, we will parse the XML string into a DOM:

```js
function loadXmlToForm(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    // Check for parser errors
    if (xmlDoc.getElementsByTagName("parsererror").length) {
      alert("Error: The XML file is not well-formed.");
      return;
    }
    // Extract elements by tag name or XPath and populate form fields
    const ir = xmlDoc.getElementsByTagName("IrRegularReport")[0];
    if (!ir) {
      alert("Invalid XML: Root <IrRegularReport> not found.");
      return;
    }
    // Example: get SourceID value
    const sourceIdVal = ir.getElementsByTagName("SourceId")[0]?.textContent;
    if (sourceIdVal) document.getElementById('sourceId').value = sourceIdVal;
    // Similarly fill other fields...
    // e.g., ReportNumber, ReportDate, etc.
    const reportMeta = ir.getElementsByTagName("ReportMetaData")[0];
    if (reportMeta) {
      const reportNum = reportMeta.getElementsByTagName("ReportNumber")[0]?.textContent;
      if (reportNum) document.getElementById('reportNumber').value = reportNum;
      // etc. for other metadata fields.
    }
    // For related reports, involved entities, accounts:
    // We'll iterate through the XML nodes and create corresponding form entries.
    // For example, for each <RelatedReport> node, call addRelatedReportRow() and fill its fields.
    // For each <Person> in ListOfInvolvedEntities, call addPersonForm() and fill values.
    // Similarly for <Corporate> and <IrRegularAccount>/<IrRegularOtherAccount>.
  } catch (err) {
    console.error("XML parsing error:", err);
    alert("Failed to parse XML file.");
  }
}
```

This function will traverse the XML. We will likely use DOM methods or XPath for convenience (some browsers support `evaluate` for XPath which could find nodes easily by paths like `IrRegularReport/ReportMetaData/ReportDate`). Using tag names is fine given the structure is known and relatively unique.

For repeating sections (RelatedReports, Persons, Corporates, Accounts), the code will loop:

* e.g., `xmlDoc.getElementsByTagName("RelatedReport")` returns a list. For each, we create a new related report entry in the form (simulate clicking "Add related report" button), then fill the number and relation fields from the XML (`ReportNumber` and the `RelationTypeID` in `RelationsToEvent`).
* For persons: loop through each `<Person>` node under `<Persons>`, create a new person form section, then fill all subfields (Name, ID, etc.) from that node’s children.
* For corporates: similar approach.
* For accounts: loop `<IrRegularAccount>` and `<IrRegularOtherAccount>` nodes. For each, create a new account entry row in the form. We can set a hidden field or property on the entry to indicate which category it came from (so if the user edits it, we know how to output it back; or we can determine at output time based on country/type logic again). Fill account number, institution type, etc., from the XML child elements.

The parsing will be careful to handle optional fields (check if node exists before accessing). Also, enumerated code values will be filled as their underlying code (the form stores the code in the dropdown value). For example, if the XML has `<ReportStatus>2</ReportStatus>`, we set the Report Status dropdown to the option value "2". We may also switch the UI language to one matching the XML content or let the user decide (probably leave as is).

After loading, the user can review and modify any values in the form.

### Form Validation & Business Rules

We implement validation at two stages: **interactive validation** on the form (as the user fills data or when they attempt to proceed/download) and **schema validation** on the final XML.

**Interactive Form Validation:**

Each input field and section is validated via JavaScript:

* We will use HTML5 validation attributes where possible (e.g. `required`, `type="email"`, pattern regex for formats like dates, ID numbers, etc.), so the browser can catch some errors natively.
* For more complex logic (conditional requirements, cross-field dependencies), we write custom validation functions.

For example:

* When the user selects a **Report Status** that is not "1 – New", we can display a message like “Please add at least one Related Report in section 3” if they haven’t done so. We might even disable the "Validate XML" or "Download XML" buttons until that condition is satisfied.
* When adding an involved person with **Residence Status = 5 (Other)**, the form will reveal the ResidenceStatusDesc field and mark it required. If the user tries to save that person without filling it, an error will be shown next to that field.
* For addresses, if the user enters "777777" in City Code, we ensure the City Name field is not empty (and vice versa: if they typed a City Name for an Israeli address, we could set City Code to 777777 behind the scenes to satisfy schema, but from user perspective just highlight if both city code and name are blank).
* If **ID Type = Other** for any person/corp or the reporter, we require the description field (and possibly enforce that the code used for Other is a specific value like 99 or similar depending on enumerations).
* If **Gender = 99 (Other)** for a person, require the Gender description field.
* **Occupation Code**: if "xxxx" is entered, require the Occupation description.
* **Phone numbers**: ensure they include only permissible characters (digits, +, -, parentheses). We might use a simple regex or even an input mask library for phone format.
* **Email**: if present, ensure it matches a basic email regex (or rely on `type="email"` which does a simple validation).
* **Dates**: ensure date fields have valid dates. Using the input type="date" will help (it will enforce format and give a date picker). We might also ensure birth date or foundation date is not in the future, etc., if such business rule is relevant.
* **Numerical ranges**: Some codes have fixed number of digits or specific ranges. E.g., Israeli bank codes are mostly under 3 digits; if a user enters a code not in the known list, we might warn. However, since enumerations.xsd will ultimately catch invalid codes on schema validation, it's okay if our form doesn’t catch every wrong code. We aim to catch obvious mistakes to save the user time.

Validation messages will be displayed in the current UI language. We will have a mechanism to show these either as inline small text under the fields or as a summary at top of the section. For usability, we can do inline. For example:

```js
function showFieldError(fieldId, messageKey) {
  // Look up the message in translations for current language
  const lang = currentLanguage;
  const msgText = translations[lang][messageKey];
  // Create or find an error span for this field
  let errSpan = document.querySelector(`#${fieldId} + .error-message`);
  if (!errSpan) {
    errSpan = document.createElement('span');
    errSpan.classList.add('error-message');
    const fieldElem = document.getElementById(fieldId);
    fieldElem.parentNode.appendChild(errSpan);
  }
  errSpan.textContent = msgText;
}
```

We will call such a function when a validation fails. For instance, on form submission or when pressing "Validate XML", we will iterate through required fields and apply these checks. Alternatively, we can validate section by section when the user leaves the section or uses a “Validate” button.

Dynamic checks like ensuring **Related Reports** exist if needed might be done when clicking "Validate XML" as a final gate.

**Schema Validation (XSD):**

Even after our own checks, the user can press the **"Validate XML"** button to perform a thorough validation against the XSDs. This uses the WebAssembly approach with libxml2:

* We will include a compiled script (e.g. `xmlvalidate.js`) which sets up a Web Worker for validation. This might be provided by an external library (like the openscd/xmlvalidate project) or a similar one.

* The app will have the XSD files (`common.xsd`, `enumerations.xsd`, `irregularReport.xsd`) available, likely bundled in the app package. When the user triggers schema validation, we post these schemas to the worker:

  ```js
  const validatorWorker = new Worker('xmlvalidator-worker.js');
  // In xmlvalidator-worker.js, the xmlvalidate WASM is initialized.
  // Load schemas:
  validatorWorker.postMessage({ content: commonXsdText, name: "common.xsd" });
  validatorWorker.postMessage({ content: enumerationsXsdText, name: "enumerations.xsd" });
  validatorWorker.postMessage({ content: irregularXsdText, name: "irregularReport.xsd" });
  validatorWorker.onmessage = function(e) {
    if (e.data.loaded && e.data.name === "irregularReport.xsd") {
      // All schemas loaded (assuming irregularReport.xsd imports the others)
      const xmlString = generateXmlString(); // function that builds XML from form
      validatorWorker.postMessage({ content: xmlString, name: "report.xml" });
    } else if (e.data.name === "report.xml") {
      // Got validation result
      if (e.data.errors && e.data.errors.length > 0) {
        console.log("Schema validation errors:", e.data.errors);
        alert("XML Validation failed. Errors:\n" + e.data.errors.join("\n"));
      } else {
        alert("XML is valid against XSD schemas!");
      }
    }
  };
  ```

  The `xmlvalidate.js` library, as per its usage example, loads XSD content when the message name ends in `.xsd`, and then validates any message that is not an XSD as an XML against the loaded schemas. We will follow that pattern. We must ensure to load **all three XSDs** in the worker *before* validating the XML. The irregularReport.xsd likely imports or includes the other two, but since we cannot fetch them (no network), we supply them manually. The worker will use the content we supply for those import references.

* If the XML is not valid, the worker will return errors (likely a list of error strings indicating line numbers and issues). We will catch those and display to the user. The message might not be localized (it will be in English, from libxml2), but we can at least show the user something meaningful. We might parse the error text to highlight the field or section that failed if possible. For instance, an error about `ReportNumber` missing would clearly indicate the user forgot that field; we could then highlight that field.

* If the XML is fully valid, we can let the user know with a success message (and then allow download).

This schema validation is critical because it ensures not only that required fields are present (which our form checks do) but also that all codes and values conform to the enumerations and patterns defined by the authority. For example, it will catch if a user entered an invalid country code or a bank code that isn’t in the enumeration list, etc., which our own checks might not fully cover. By integrating this step client-side, we give immediate feedback to the user, who can correct mistakes before submission to the regulator’s system.

The WebAssembly (WASM) approach means all of this happens in the browser without sending data out. This addresses privacy and offline requirements. The chosen library (xmlvalidate with libxml2) is capable of handling the XSD complexity. The performance for a single report XML is very fast, as the XML will not be huge (maybe tens of KB).

If for any reason the WASM validation fails to run (maybe due to browser incompatibility), we will still have the form-level validations to catch most issues. We can also allow the user to proceed to download XML and trust that the receiving system will validate and report errors if any. But our aim is to catch errors here.

### XML Generation for Download

When the user is satisfied with the form (and ideally after passing validation), they can click **"Download XML"**. The application will then construct the XML document from the form data. We have two possible methods:

1. Using the DOM API to create an XML Document and then serializing it to string.
2. Manually composing an XML string.

Using the DOM is safer to ensure correct escaping of special characters (like `&` in text). We will proceed with DOM approach:

```js
function generateXmlString() {
  const impl = document.implementation;
  const xmlDoc = impl.createDocument(null, "IrRegularReport", null);
  const ir = xmlDoc.documentElement;
  // Optionally add namespace declarations if needed, e.g. ir.setAttribute("xmlns", "some-uri");
  // (The XSD might require specific namespace, but assuming it's default with no prefix.)

  // Fill Reporting Entity Details:
  const srcMeta = xmlDoc.createElement("IrRegularSourceMetaData");
  // e.g., SourceType
  const sourceTypeEl = xmlDoc.createElement("SourceType");
  sourceTypeEl.textContent = document.getElementById("sourceType").value; // "7"
  srcMeta.appendChild(sourceTypeEl);
  // SourceId, SourceName, BranchId similarly:
  ["sourceId", "sourceName", "branchId"].forEach(id => {
    const el = xmlDoc.createElement(id.charAt(0).toUpperCase() + id.slice(1)); // capitalize id to match element
    el.textContent = document.getElementById(id).value;
    srcMeta.appendChild(el);
  });
  // ReportingPerson sub-element:
  const repPersonEl = xmlDoc.createElement("ReportingPerson");
  // Add FirstName, LastName, etc. inside repPersonEl
  // Example:
  const fnEl = xmlDoc.createElement("FirstName");
  fnEl.textContent = document.getElementById("reporterFirstName").value;
  repPersonEl.appendChild(fnEl);
  // ... do same for LastName, Phone (create Phones->Phone structure with Number inside), Email (Emails->Email->EmailAddress), Role, IDNumber, IDType, IDTypeDesc (if exists), IDCountry.
  srcMeta.appendChild(repPersonEl);
  ir.appendChild(srcMeta);

  // ReportMetaData:
  const metaEl = xmlDoc.createElement("ReportMetaData");
  const reportTypeEl = xmlDoc.createElement("ReportType");
  reportTypeEl.textContent = "2";
  metaEl.appendChild(reportTypeEl);
  // ReportClassification, use fixed "10":
  const classEl = xmlDoc.createElement("ReportClassification");
  classEl.textContent = "10";
  metaEl.appendChild(classEl);
  // ReportNumber:
  const repNumEl = xmlDoc.createElement("ReportNumber");
  repNumEl.textContent = document.getElementById("reportNumber").value;
  metaEl.appendChild(repNumEl);
  // ReportDate:
  const repDateEl = xmlDoc.createElement("ReportDate");
  repDateEl.textContent = document.getElementById("reportDate").value;
  metaEl.appendChild(repDateEl);
  // ReportDescription:
  const repDescEl = xmlDoc.createElement("ReportDescription");
  repDescEl.textContent = document.getElementById("reportDescription").value;
  metaEl.appendChild(repDescEl);
  // ReportStatus:
  const repStatusEl = xmlDoc.createElement("ReportStatus");
  repStatusEl.textContent = document.getElementById("reportStatus").value;
  metaEl.appendChild(repStatusEl);
  ir.appendChild(metaEl);

  // Version element:
  const verEl = xmlDoc.createElement("Version");
  verEl.textContent = "1.0";
  ir.appendChild(verEl);

  // RelatedReports (if any):
  const relatedList = document.querySelectorAll(".relatedReportEntry");
  if (relatedList.length > 0) {
    const relatedReportsEl = xmlDoc.createElement("RelatedReports");
    relatedList.forEach(entry => {
      const relReportEl = xmlDoc.createElement("RelatedReport");
      const prevNum = entry.querySelector(".relatedNumber").value;
      const relNumEl = xmlDoc.createElement("ReportNumber");
      relNumEl.textContent = prevNum;
      relReportEl.appendChild(relNumEl);
      // relation type
      const relToEventEl = xmlDoc.createElement("RelationsToEvent");
      const relationEl = xmlDoc.createElement("Relation");
      const relTypeIdEl = xmlDoc.createElement("RelationTypeID");
      relTypeIdEl.textContent = entry.querySelector(".relationType").value;
      relationEl.appendChild(relTypeIdEl);
      // If relationType is 'Other' (say code 7 in this context) and a description was provided:
      const relTypeCode = entry.querySelector(".relationType").value;
      if (relTypeCode === "7") { // assuming 7 indicates 'Other relation' as per codes
        const relTypeDescEl = xmlDoc.createElement("RelationTypeDesc");
        relTypeDescEl.textContent = entry.querySelector(".relationTypeDesc").value;
        relationEl.appendChild(relTypeDescEl);
      }
      relToEventEl.appendChild(relationEl);
      relReportEl.appendChild(relToEventEl);
      relatedReportsEl.appendChild(relReportEl);
    });
    ir.appendChild(relatedReportsEl);
  }

  // Involved Entities (ListOfInvolvedEntities):
  const entitiesEl = xmlDoc.createElement("ListOfInvolvedEntities");
  // We might include a ReporterObjID if needed (internal linking id), but skipping as optional.
  // Persons:
  const persons = document.querySelectorAll(".personEntry");
  if (persons.length > 0) {
    const personsEl = xmlDoc.createElement("Persons");
    persons.forEach(personForm => {
      const personEl = xmlDoc.createElement("Person");
      // Fill person fields similarly:
      const lastNameEl = xmlDoc.createElement("LastName");
      lastNameEl.textContent = personForm.querySelector(".lastName").value;
      personEl.appendChild(lastNameEl);
      const firstNameEl = xmlDoc.createElement("FirstName");
      firstNameEl.textContent = personForm.querySelector(".firstName").value;
      personEl.appendChild(firstNameEl);
      // LatinName, LatinSurname if exist:
      const latinNameVal = personForm.querySelector(".latinName").value;
      if (latinNameVal) {
        const latinNameEl = xmlDoc.createElement("LatinName");
        latinNameEl.textContent = latinNameVal;
        personEl.appendChild(latinNameEl);
      }
      const latinSurnameVal = personForm.querySelector(".latinSurname").value;
      if (latinSurnameVal) {
        const latinSurEl = xmlDoc.createElement("LatinSurname");
        latinSurEl.textContent = latinSurnameVal;
        personEl.appendChild(latinSurEl);
      }
      // BirthDate:
      const bdateEl = xmlDoc.createElement("BirthDate");
      bdateEl.textContent = personForm.querySelector(".birthDate").value;
      personEl.appendChild(bdateEl);
      // Gender + desc if needed:
      const genderCode = personForm.querySelector(".gender").value;
      const genderEl = xmlDoc.createElement("EntityGender");
      genderEl.textContent = genderCode;
      personEl.appendChild(genderEl);
      if (genderCode === "99") {
        const genderDescEl = xmlDoc.createElement("EntityGenderDesc");
        genderDescEl.textContent = personForm.querySelector(".genderDesc").value;
        personEl.appendChild(genderDescEl);
      }
      // ResidenceStatus + desc if needed:
      const statusCode = personForm.querySelector(".residenceStatus").value;
      const statusEl = xmlDoc.createElement("ResidenceStatus");
      statusEl.textContent = statusCode;
      personEl.appendChild(statusEl);
      if (statusCode === "5") {
        const statusDescEl = xmlDoc.createElement("ResidenceStatusDesc");
        statusDescEl.textContent = personForm.querySelector(".residenceStatusDesc").value;
        personEl.appendChild(statusDescEl);
      }
      // Identification:
      const idTypeVal = personForm.querySelector(".idType").value;
      if (idTypeVal) {  // if provided
        const idNumEl = xmlDoc.createElement("IDNumber");
        idNumEl.textContent = personForm.querySelector(".idNumber").value;
        personEl.appendChild(idNumEl);
        const idTypeEl = xmlDoc.createElement("IDType");
        idTypeEl.textContent = idTypeVal;
        personEl.appendChild(idTypeEl);
        if (idTypeVal === "99") {
          const idTypeDescEl = xmlDoc.createElement("IDTypeDesc");
          idTypeDescEl.textContent = personForm.querySelector(".idTypeDesc").value;
          personEl.appendChild(idTypeDescEl);
        }
        const idCountryEl = xmlDoc.createElement("IDCountry");
        idCountryEl.textContent = personForm.querySelector(".idCountry").value;
        personEl.appendChild(idCountryEl);
      }
      // Occupation:
      const profCode = personForm.querySelector(".occupationCode").value;
      if (profCode) {
        const profCodesEl = xmlDoc.createElement("ProfessionTypeCodes");
        const profCodeEl = xmlDoc.createElement("ProfessionTypeCode");
        profCodeEl.textContent = profCode;
        profCodesEl.appendChild(profCodeEl);
        personEl.appendChild(profCodesEl);
        if (profCode === "xxxx") {
          const profDescEl = xmlDoc.createElement("Profession");
          profDescEl.textContent = personForm.querySelector(".occupationDesc").value;
          personEl.appendChild(profDescEl);
        }
      }
      // Addresses:
      const addresses = personForm.querySelectorAll(".addressEntry");
      if (addresses.length > 0) {
        const addrsEl = xmlDoc.createElement("Addresses");
        addresses.forEach(addr => {
          const addrEl = xmlDoc.createElement("Address");
          const countryEl = xmlDoc.createElement("CountryID");
          countryEl.textContent = addr.querySelector(".addrCountry").value;
          addrEl.appendChild(countryEl);
          // City:
          const cityCodeVal = addr.querySelector(".addrCityCode").value;
          const cityNameVal = addr.querySelector(".addrCityName").value;
          if (cityCodeVal) {
            const cityCodeEl = xmlDoc.createElement("CityCode");
            cityCodeEl.textContent = cityCodeVal;
            addrEl.appendChild(cityCodeEl);
          }
          if (cityNameVal) {
            const cityNameEl = xmlDoc.createElement("CityName");
            cityNameEl.textContent = cityNameVal;
            addrEl.appendChild(cityNameEl);
          }
          // Street:
          const streetCodeVal = addr.querySelector(".addrStreetCode").value;
          const streetNameVal = addr.querySelector(".addrStreetName").value;
          if (streetCodeVal) {
            const streetCodeEl = xmlDoc.createElement("StreetCode");
            streetCodeEl.textContent = streetCodeVal;
            addrEl.appendChild(streetCodeEl);
          }
          if (streetNameVal) {
            const streetNameEl = xmlDoc.createElement("StreetName");
            streetNameEl.textContent = streetNameVal;
            addrEl.appendChild(streetNameEl);
          }
          // HouseNumber:
          const houseEl = xmlDoc.createElement("HouseNumber");
          houseEl.textContent = addr.querySelector(".addrHouse").value;
          addrEl.appendChild(houseEl);
          // ZIP codes:
          const zipNewVal = addr.querySelector(".addrZipNew").value;
          const zipOldVal = addr.querySelector(".addrZipOld").value;
          if (zipNewVal) {
            const newZipEl = xmlDoc.createElement("NewZIPCode");
            newZipEl.textContent = zipNewVal;
            addrEl.appendChild(newZipEl);
          }
          if (zipOldVal) {
            const zipEl = xmlDoc.createElement("ZIPCode");
            zipEl.textContent = zipOldVal;
            addrEl.appendChild(zipEl);
          }
          addrsEl.appendChild(addrEl);
        });
        personEl.appendChild(addrsEl);
      }
      // Phones:
      const phones = personForm.querySelectorAll(".phoneEntry");
      if (phones.length > 0) {
        const phonesEl = xmlDoc.createElement("Phones");
        phones.forEach(ph => {
          const phoneEl = xmlDoc.createElement("Phone");
          const typeEl = xmlDoc.createElement("PhoneType");
          typeEl.textContent = ph.querySelector(".phoneType").value;
          phoneEl.appendChild(typeEl);
          const numEl = xmlDoc.createElement("Number");
          numEl.textContent = ph.querySelector(".phoneNumber").value;
          phoneEl.appendChild(numEl);
          phonesEl.appendChild(phoneEl);
        });
        personEl.appendChild(phonesEl);
      }
      // Emails:
      const emails = personForm.querySelectorAll(".emailEntry");
      if (emails.length > 0) {
        const emailsEl = xmlDoc.createElement("Emails");
        emails.forEach(em => {
          const emailEl = xmlDoc.createElement("Email");
          const addrEl = xmlDoc.createElement("EmailAddress");
          addrEl.textContent = em.querySelector(".emailAddress").value;
          emailEl.appendChild(addrEl);
          emailsEl.appendChild(emailEl);
        });
        personEl.appendChild(emailsEl);
      }
      // Relation to event:
      const relTypeVal = personForm.querySelector(".entityRelationType")?.value;
      if (relTypeVal) {
        const relToEventEl = xmlDoc.createElement("RelationsToEvent");
        const relationEl = xmlDoc.createElement("Relation");
        const relTypeEl = xmlDoc.createElement("RelationTypeID");
        relTypeEl.textContent = relTypeVal;
        relationEl.appendChild(relTypeEl);
        if (relTypeVal === "6") { // assume 6 means Other in entity relation context
          const relDescEl = xmlDoc.createElement("RelationTypeDesc");
          relDescEl.textContent = personForm.querySelector(".entityRelationDesc").value;
          relationEl.appendChild(relDescEl);
        }
        relToEventEl.appendChild(relationEl);
        personEl.appendChild(relToEventEl);
      }
      personsEl.appendChild(personEl);
    });
    entitiesEl.appendChild(personsEl);
  }
  // Corporates:
  // (similar approach as persons, but with corporate fields: Name instead of LastName, no FirstName, FoundationDate, etc.)
  const corps = document.querySelectorAll(".corporateEntry");
  if (corps.length > 0) {
    const corpsEl = xmlDoc.createElement("Corporates");
    corps.forEach(corpForm => { /* ... fill Corporate ... */ });
    entitiesEl.appendChild(corpsEl);
  }
  if (entitiesEl.hasChildNodes()) {
    ir.appendChild(entitiesEl);
  }

  // Accounts:
  // We'll create IrRegularAccounts and IrRegularOtherAccounts as needed:
  const accounts = document.querySelectorAll(".accountEntry");
  if (accounts.length > 0) {
    const acctLocalEl = xmlDoc.createElement("IrRegularAccounts");
    const acctOtherEl = xmlDoc.createElement("IrRegularOtherAccounts");
    accounts.forEach(accForm => {
      const accTypeCode = accForm.querySelector(".finInstitutionType").value;
      const country = accForm.querySelector(".finInstitutionCountry").value;
      // Decide if local or other:
      let accEl;
      if (country === "IL" && (accTypeCode === "1" || accTypeCode === "6" /* bank or postal bank codes */)) {
        accEl = xmlDoc.createElement("IrRegularAccount");
      } else {
        accEl = xmlDoc.createElement("IrRegularOtherAccount");
      }
      // Fill common fields:
      const accNumEl = xmlDoc.createElement("AccountNum");
      accNumEl.textContent = accForm.querySelector(".accountNumber").value;
      accEl.appendChild(accNumEl);
      const finTypeEl = xmlDoc.createElement("FinancialInstituteType");
      finTypeEl.textContent = accTypeCode;
      accEl.appendChild(finTypeEl);
      const finCountryEl = xmlDoc.createElement("FinancialInstituteCountry");
      finCountryEl.textContent = country;
      accEl.appendChild(finCountryEl);
      // FinancialInstituteID and Name:
      const finIdVal = accForm.querySelector(".financialInstID").value;
      if (finIdVal) {
        const finIdEl = xmlDoc.createElement("FinancialInstituteID");
        finIdEl.textContent = finIdVal;
        accEl.appendChild(finIdEl);
      }
      const finNameVal = accForm.querySelector(".financialInstName").value;
      if (finNameVal) {
        const finNameEl = xmlDoc.createElement("FinancialInstituteName");
        finNameEl.textContent = finNameVal;
        accEl.appendChild(finNameEl);
      }
      // Branch:
      const branchIdVal = accForm.querySelector(".branchId")?.value;
      const branchNameVal = accForm.querySelector(".branchName")?.value;
      if (branchIdVal) {
        const branchIdEl = xmlDoc.createElement("BranchID");
        branchIdEl.textContent = branchIdVal;
        accEl.appendChild(branchIdEl);
      }
      if (branchNameVal) {
        const branchNameEl = xmlDoc.createElement("BranchName");
        branchNameEl.textContent = branchNameVal;
        accEl.appendChild(branchNameEl);
      }
      // RelationsToEvent for account:
      const relToEventEl = xmlDoc.createElement("RelationsToEvent");
      const relationEl = xmlDoc.createElement("Relation");
      const relTypeEl = xmlDoc.createElement("RelationTypeID");
      const accRelVal = accForm.querySelector(".accountRelationType").value;
      relTypeEl.textContent = accRelVal;
      relationEl.appendChild(relTypeEl);
      if (accRelVal === "6") { // 'Other' relation
        const relDescEl = xmlDoc.createElement("RelationTypeDesc");
        relDescEl.textContent = accForm.querySelector(".accountRelationDesc").value;
        relationEl.appendChild(relDescEl);
      }
      // If linking to an entity by ReporterObjID/RelatedObjID is required, we could include RelatedObjID here referencing an involved entity's internal ID if that were implemented. For now, skip detailed linking.
      relToEventEl.appendChild(relationEl);
      accEl.appendChild(relToEventEl);
      // Now append accEl to the appropriate parent:
      if (accEl.tagName === "IrRegularAccount") {
        acctLocalEl.appendChild(accEl);
      } else {
        acctOtherEl.appendChild(accEl);
      }
    });
    if (acctLocalEl.hasChildNodes()) ir.appendChild(acctLocalEl);
    if (acctOtherEl.hasChildNodes()) ir.appendChild(acctOtherEl);
  }

  // At this point, xmlDoc contains the entire IrRegularReport populated.
  // Serialize to string:
  const serializer = new XMLSerializer();
  let xmlString = serializer.serializeToString(xmlDoc);
  // If needed, add XML header:
  xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;
  return xmlString;
}
```

The above pseudo-code in comments demonstrates the approach: create elements for each field, append appropriately. This will ensure the output XML is well-formed. We must be careful with things like ensuring the ordering of elements matches XSD (the XSD likely defines an order, which we should follow as we append; from our code, we do follow the logical order per section).

Once `generateXmlString()` obtains the XML string, the **Download XML** process is straightforward:

* Create a Blob from the string: `const blob = new Blob([xmlString], {type: 'application/xml'});`
* Create a temporary link element with `href = URL.createObjectURL(blob)` and `download = "IrRegularReport.xml"` (or per naming rules, perhaps something like `IR20230101_1234.zip` if needed).
* Programmatically click the link to trigger download, then revoke the URL.

If the requirement is to download a ZIP containing the XML (and possibly other files like a manifest), we can use a JS zip library (like JSZip) to package the XML into a zip on the client. But the prompt suggests just generating the XML. It mentions all supporting files in a ZIP, which likely refers to distributing the app itself. The actual report likely should be named and zipped according to some convention (like including SourceID, BranchID, ReportDate in the filename). We could implement the naming rule:

* e.g., file name format: `{SourceId}_{BranchId}_{ReportDate(without hyphens)}_{ReportNumber}.zip` as hinted by documentation. However, producing a zip with a single XML inside (plus maybe a dummy “End of Report” file or so) might be needed if that's how they are submitted.
* If needed, we can indeed use JSZip: put the XML string as a file inside, and trigger download of the zip. This is an optional enhancement.

For simplicity, we might allow **Download XML** to just download the `.xml` directly, and instruct the user that if a zip is needed, they can compress it after. Or we include a small note.

We will ensure that before downloading, either the user ran validation or we run `generateXmlString()` through the validator one more time. If validation errors exist, we may warn the user “The XML has issues, download anyway?” – but since they explicitly clicked download, maybe assume they want it anyway.

### PDF Generation (Summary Report)

For creating a PDF summary, we use **jsPDF** library. We will include the jsPDF script in the page, either via CDN or a local copy:

```html
<script src="libs/jspdf.umd.min.js"></script>
```

(either from a CDN like `cdnjs.cloudflare.com` or bundled if offline).

When the user clicks **"Download PDF Summary"**, we gather the filled data and format it into a human-readable summary. This is not an official regulatory output, just a user-friendly report. We will likely include each section with key-value pairs of the data.

For example, using jsPDF:

```js
function downloadPdfSummary() {
  const doc = new jsPDF();  // create new PDF document
  const lineHeight = 10;
  let y = 10;
  // Title
  doc.setFontSize(16);
  doc.text(translations[currentLanguage]['pdf_title'] || "Irregular Report Summary", 105, y, {align: 'center'}); 
  y += 10;
  doc.setFontSize(12);
  // Section 1: Reporting Entity
  doc.text(translations[currentLanguage]['section1_title'], 10, y); y += lineHeight;
  doc.setFontSize(10);
  doc.text(`${translations[currentLanguage]['sourceId_label']}: ${document.getElementById('sourceId').value}`, 14, y); y += lineHeight;
  doc.text(`${translations[currentLanguage]['sourceName_label']}: ${document.getElementById('sourceName').value}`, 14, y); y += lineHeight;
  doc.text(`${translations[currentLanguage]['branchId_label']}: ${document.getElementById('branchId').value}`, 14, y); y += lineHeight;
  doc.text(`${translations[currentLanguage]['reporterName_label']}: ${document.getElementById('reporterFirstName').value} ${document.getElementById('reporterLastName').value}`, 14, y); y += lineHeight;
  doc.text(`${translations[currentLanguage]['reporterRole_label']}: ${document.getElementById('reporterRole').value}`, 14, y); y += lineHeight;
  // ... include phone/email of reporter
  y += 5;
  doc.setFontSize(12);
  doc.text(translations[currentLanguage]['section2_title'], 10, y); y += lineHeight;
  doc.setFontSize(10);
  doc.text(`${translations[currentLanguage]['reportNumber_label']}: ${document.getElementById('reportNumber').value}`, 14, y); y += lineHeight;
  doc.text(`${translations[currentLanguage]['reportDate_label']}: ${document.getElementById('reportDate').value}`, 14, y); y += lineHeight;
  doc.text(`${translations[currentLanguage]['reportStatus_label']}: ${document.getElementById('reportStatus').selectedOptions[0].text}`, 14, y); y += lineHeight;
  // If report status not new, include related reports in summary:
  if (document.getElementById('reportStatus').value !== '1') {
    const relatedEntries = document.querySelectorAll('.relatedReportEntry');
    relatedEntries.forEach(entry => {
      const num = entry.querySelector('.relatedNumber').value;
      const relTypeText = entry.querySelector('.relationType').selectedOptions[0].text;
      doc.text(`- ${translations[currentLanguage]['relatedReport_label']}: ${num} (${relTypeText})`, 18, y); 
      y += lineHeight;
    });
  }
  // Continue for involved entities:
  doc.setFontSize(12); doc.text(translations[currentLanguage]['section4_title'], 10, y); y += lineHeight;
  doc.setFontSize(10);
  const personEntries = document.querySelectorAll('.personEntry');
  personEntries.forEach((personForm, index) => {
    const fullName = personForm.querySelector('.firstName').value + " " + personForm.querySelector('.lastName').value;
    doc.text(`${translations[currentLanguage]['person_label']} #${index+1}: ${fullName}`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['id_label']}: ${personForm.querySelector('.idNumber').value} (${personForm.querySelector('.idType').selectedOptions[0].text})`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['birthDate_label']}: ${personForm.querySelector('.birthDate').value}`, 14, y); y += lineHeight;
    // ... and other key details like gender, residency, perhaps occupation and a short address snippet.
    // You might list one address or multiple addresses succinctly.
  });
  const corpEntries = document.querySelectorAll('.corporateEntry');
  corpEntries.forEach((corpForm, index) => {
    doc.text(`${translations[currentLanguage]['corp_label']} #${index+1}: ${corpForm.querySelector('.name').value}`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['registration_label']}: ${corpForm.querySelector('.idNumber').value} (${corpForm.querySelector('.idType').selectedOptions[0].text})`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['foundationDate_label']}: ${corpForm.querySelector('.foundationDate').value}`, 14, y); y += lineHeight;
    // ... plus other details like residence status, business field.
  });
  // Accounts:
  doc.setFontSize(12); doc.text(translations[currentLanguage]['section5_title'], 10, y); y += lineHeight;
  doc.setFontSize(10);
  const accountEntries = document.querySelectorAll('.accountEntry');
  accountEntries.forEach((accForm, index) => {
    const acctNo = accForm.querySelector('.accountNumber').value;
    const instName = accForm.querySelector('.financialInstName').value || accForm.querySelector('.financialInstID').value;
    const country = accForm.querySelector('.financialInstCountry').value;
    doc.text(`${translations[currentLanguage]['account_label']} #${index+1}: ${acctNo}`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['institution_label']}: ${instName} (${country})`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['branch_label']}: ${accForm.querySelector('.branchName')?.value || accForm.querySelector('.branchId')?.value}`, 14, y); y += lineHeight;
    doc.text(`  ${translations[currentLanguage]['accountRelation_label']}: ${accForm.querySelector('.accountRelationType').selectedOptions[0].text}`, 14, y); y += lineHeight;
  });
  // Finalize PDF
  doc.save("IrregularReportSummary.pdf");
}
```

This function uses jsPDF to position text. We use a basic approach: simply writing lines of text. We keep track of the `y` position (vertical) and increment it for each line. We include section titles to break up data. We reference `translations` for labels so that the PDF headings and field labels appear in the currently selected language. For Hebrew (RTL), jsPDF has support via setting text direction or we might simply mirror text if needed. Alternatively, we could temporarily switch the UI to the desired language then generate the PDF so that all `selectedOptions[0].text` etc. yield the correct language. It might be easier to force PDF always in one language (like English) for simplicity, but the requirement says in the selected language, so we'll adhere to that.

If needed, we can adjust alignment for Hebrew by using `doc.text(..., {align: 'right'})` with appropriate x coordinate (like 200 or so) to right-align, because in RTL we might want right alignment. jsPDF also allows setting `doc.setLanguage('he')` or similar if needed for proper encoding. But given we mostly output standard characters (assuming Hebrew text is supported by jsPDF’s font), we should ensure to use a font that supports Hebrew (jsPDF default is likely Helvetica which may not have Hebrew glyphs; we might need to include a font or use a built-in supporting font like maybe `doc.setFont("Courier");` which might still not support it). If needed, we could generate the PDF in English only to avoid font issues, but let's assume we manage a font that supports Unicode. Possibly jsPDF 2.5+ supports UTF-8 by default using a subset of fonts.

The content of the PDF is a summary, not a verbatim reproduction of the XML, so we focus on the main points. If needed, the PDF generation can be as elaborate as adding table structures or multi-line text wrapping for addresses. But for this simple scope, plaintext lines are acceptable.

This PDF feature gives the compliance officer or user an easy-to-read document (for internal use or for record-keeping) without having to read raw XML. It’s generated entirely on the client. **jsPDF** is a reliable library for this, as demonstrated by a simple example of adding text and saving the PDF. We will leverage it similarly: create document, add text, save file.

### Packaging and Additional Files

All required files will be packaged for local use:

* The **HTML**, **CSS**, and **JS** files for the form.
* The **XSD files**: `common.xsd`, `enumerations.xsd`, `irregularReport.xsd` will be included in the distribution (likely in a `/schemas` folder). The application references them for validation (by reading them as text via fetch or embedding as JS strings).
* The **jsPDF library** (minified) can be included as a `.js` file in a `libs` folder or via CDN. If offline usage is key, we include it locally.
* The **WASM validator**: This includes `xmlvalidate.js` (which likely loads a `.wasm` binary internally). We will include those files (or a similar library) in a `libs` folder. For example, `xmlvalidator-worker.js` (our custom worker script) will import `xmlvalidate.js`. The `xmlvalidate.wasm` would be co-located so that the worker can load it (xmlvalidate.js typically fetches the wasm file, but since no network, we might embed it or ensure it’s available at correct path).

We ensure that when the user downloads the entire tool (as a ZIP of the web app), all these files are present so that it can run fully offline. The user simply opens `index.html` in a browser and everything works.

**Note on file naming**: The final downloaded **XML file name** can be automatically generated to follow the authority’s conventions. For instance, the doc hints that SourceId and BranchId and ReportDate form part of the ZIP name. We could name the XML or ZIP accordingly, e.g., `IR_<SourceId>_<BranchId>_<ReportDateYYYYMMDD>_<ReportNumber>.xml`. However, implementing that naming is straightforward using the form values. We will include instructions or code to do so when setting the download filename. For now, it's acceptable to name it something generic like "IrRegularReport.xml", but this can be refined.

Finally, we will provide any **helper scripts** needed:

* e.g., a small script to initialize event handlers for adding/removing dynamic list items (for Related Reports, Entities, Accounts).
* a script for toggling sections (if we implement hide/show).
* any needed polyfills (if older browsers need them for things like `HTMLInputElement.reportValidity` or so).
* The code to perform PDF creation and XML validation as described.

All these will be well-organized and commented in the `task.md` so that Codex (or a developer) can easily scaffold the actual code. By following this specification, the generated application will allow users to prepare a complete IrregularReport, in compliance with the schema and business rules, with a user-friendly bilingual interface and offline capabilities.

**Sources:**

* The field requirements and code values are based on the *IrregularReport Programmer’s Guide* (מדריך לתוכניתן) provided and related documentation, ensuring the form structure aligns with the official schema.
* The approach for client-side XSD validation uses the libxml2 WebAssembly library as recommended on Stack Overflow, enabling in-browser schema compliance checking.
* PDF generation method is adapted from jsPDF usage examples to output text content to a downloadable PDF file.
