# 🔒 Privacy Policy for Lesewelle

**Effective Date:** 03/12/2025

### 1. Introduction & Organizational Info (Data Controller)
By installing and using the Lesewelle Chrome extension, you acknowledge that you have read and agree to this Privacy Policy. Using the extension to select text constitutes your consent to the processing of that specific text.

We, at Lesewelle, are dedicated to providing our language assistance services through the Lesewelle Chrome extension. We are committed to the responsible and secure management of personal data in full compliance with the **General Data Protection Regulation (GDPR)** and all relevant EU privacy laws.

Our processing goals include:
* Delivering the core language reading, translation, and learning features of the extension.
* Ensuring the security and integrity of our service (e.g., through abuse prevention).
* Improving and optimizing the extension based on usage patterns.

We do not have a designated Data Protection Officer (DPO). For all privacy concerns, data subject requests, or general inquiries, please contact us:

* **Email:** `wordaiwesome@gmail.com`

---

### 2. Data We Process, Purpose, and Legal Basis (GDPR Article 13)

We only process data strictly necessary to provide our service. The table below details the data we handle, the purposes of processing, the specific legal basis under the GDPR, and the retention criteria.

| Category of Data | Specific Data Points | Purpose of Processing | Legal Basis (GDPR Art. 6) | Retention Period / Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Content Data** | Text selected by the user on a website. | To perform the core service: NLP analysis, learning assistance, and translation via the backend/OpenAI. | **Consent (Art. 6(1)(a)).** By selecting the text and activating the extension, you explicitly consent to the processing of that specific text. | Automatically deleted right after the NLP analysis or translation is completed. |
| **Service Identifier** | A unique, system-generated **DeviceID** (randon UUID) stored in Chrome's local storage. | To authenticate your API requests to our backend and ensure service continuity across sessions. | **Contract (Art. 6(1)(b))** to provide the requested service and **Legitimate Interests (Art. 6(1)(f))** for service management and abuse prevention. | For the duration the extension is installed. Uninstalling the extension will permanently delete the generated DeviceID from your browser storage. |
| **Analytics Data** | **Hashed DeviceID** (Pseudonymous), Interaction logs (e.g., feature usage, clicks, errors). | Product analytics, optimizing user experience. | **Legitimate Interests (Art. 6(1)(f))** to maintain and improve the commercial quality of the extension. | Retention period as defined by the analytics provider. |

> **Note on DeviceID:** The DeviceID is a unique identifier used to differentiate users on our backend. As it does not directly reveal your identity but is linkable to your usage, it is treated as **pseudonymous personal data** under the GDPR.

---

### 3. Data Storage and Protection

#### Data Storage:
* **Lesewelle Backend:** Personal information processed for NLP analysis (e.g., DeviceID and the temporary selected text) is processed on secure servers located in **Germany (DE)**.
* **Content Data:** Content Data (selected text) is handled on an ephemeral basis and is deleted immediately upon processing completion.

#### Data Protection Measures:
* **Encryption:** We employ robust encryption technologies, including **SSL/TLS**, to protect data during transfer.
* **Access Control:** Access to your data is strictly limited to authorized personnel who have a legitimate, necessary business need to access the data.

---

### 4. Data Sharing and Disclosure

We share your data only when necessary to provide the services you requested. All third parties act as our processors and are bound by Data Processing Agreements (DPAs) that mandate strict compliance with GDPR.

| Service Name | Provider | Purpose(s) | Collected Personal Data Type(s) | Data Location / Transfer | Privacy Policy Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Analytics** | Amplitude, Inc. | Product analytics, improving and optimizing user experience. | Hashed DeviceID (pseudonymous), Interaction logs. | **European Union (EU) Data Center (Germany)**. | `https://amplitude.com/privacy` |
| **Translation Service** | OpenAI, L.L.C. | Performing requested language translations. | **Selected Text/Content Data.** | **United States (US)** | `https://openai.com/en-GB/policies/eu-privacy-policy/` |

#### International Data Transfers (Third Countries):

Transfers of personal data outside the EU/EEA (third countries) are handled with specific safeguards in compliance with Chapter V of the GDPR:

* **Amplitude:** We utilize Amplitude’s **EU Data Center** option. Therefore, the processing and storage of your analytics data occur within the EU and do not constitute an international data transfer as defined under Article 44 of the GDPR.
* **OpenAI:** As OpenAI is based in the United States (a third country), the temporary transfer of Content Data to them for translation constitutes an international transfer. We ensure this transfer is lawful by relying on the **Standard Contractual Clauses (SCCs)** adopted by the European Commission, implemented in our Data Processing Agreement with OpenAI.

You acknowledge that content selected for translation may be transferred to OpenAI in the US under Standard Contractual Clauses approved by the European Commission.

---

### 5. User Rights and Choices (GDPR)

In accordance with the General Data Protection Regulation (GDPR), you have the following rights concerning your personal data:

* **Access, Rectification, Erasure** (Articles 15–17)
* **Restriction of Processing, Data Portability, Object** (Articles 18, 20–21)
* **Withdraw Consent** (Article 7(3)) – for selected text, stop selecting text
* **Right to Lodge a Complaint** (Article 77): You have the right to lodge a complaint with a supervisory authority (e.g., the competent Data Protection Authority in Germany).

**Exercising Rights**: Contact us via the email in Section 1. We will respond according to GDPR timelines.

**Note**: Analytics and service identifiers are processed under legitimate interests. You cannot opt out of these in the MVP.

---

### 6. Data Controller Information
Lesewelle is developed and operated by an individual developer 
based in Germany. This is a small-scale project designed to assist users with 
German language learning. We process personal data in full compliance with GDPR 
and German data protection laws.

For questions, concerns, or to exercise your data rights, please contact us 
directly at the contact information provided in Section 1. 
