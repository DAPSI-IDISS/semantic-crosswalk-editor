# Semantic-Crosswalk-Editor (SCE)

Editor to improve Data Interoperability by bridging Standards using human-centric Semantics.

## Overview

The **purpose** of this project is to enhance the data portability of standards.

***"I love standards there are so many to choose from" -- Marshall T. Rose.***

The focus of IDSS is to develop a suite of tools to assist cross metadata (semantic) translation for domain experts. In contrast to initiatives such as the "Semantic Web", we don't build up from a projected ontology as there is no single way to model a domain using an ontology. There is no global truth. Different stakeholders in the domain may consider different semantics for metadata or even hold contradictory claims. Often metadata is designed to be intentionally vague and open to the widest range of interpretations and implementations -- see, for example, Dublin Core. The real world is messy and filled with interoperability issues. In standardization, we need to solve them beforehand through interlingua consensus constructed upon formally controlled vocabularies. These demand tools that are not the same as what people tried to develop for the "Semantic Web". we use the data and some tools but don't follow their paradigm down the rabbit hole.

### Interlingual Translation

Interlingual machine translation is one of the classic approaches to machine translation. In this approach, the source language, i.e. the text to be translated is transformed into an interlingua, i.e., an abstract language-independent representation. The target language is then generated from the interlingua. Within the rule-based machine translation paradigm, the interlingual approach is an alternative to the direct approach and the transfer approach.

In the direct approach, words are translated directly without passing through an additional representation. In the transfer approach, the source language is transformed into an abstract, less language-specific representation. Linguistic rules which are specific to the language pair then transform the source language representation into an abstract target language representation and from this, the target sentence is generated.

With an interlingua, it becomes unnecessary to make a translation pair between each pair of languages in the system. So instead of creating n ( n − 1 ) language pairs, where n is the number of languages in the system, it is only necessary to make 2 n  pairs between the n languages and the interlingua.

![image](https://user-images.githubusercontent.com/408126/149317225-d4a58f7c-c596-4da2-b97f-89d20af7d7f1.png)

The first ideas about interlingual machine translation appeared in the 17th century with Descartes and Leibniz who came up with theories of how to create dictionaries using universal numerical codes.  These codes in our context are not much different from OIDs (Object IDs): an identifier mechanism standardized by the International Telecommunication Union (ITU) and ISO/IEC for naming any object, concept, or "thing" with a globally unambiguous persistent name. OIDs, formally defined by ITU X.660, are themselves managed by shareholder groups much like DNS domains with a given OID corresponding to a node in the "OID tree". See:

* [https://www.itu.int/dms_pub/itu-t/oth/0B/04/T0B040000482C01PDFE.pdf](https://www.itu.int/dms_pub/itu-t/oth/0B/04/T0B040000482C01PDFE.pdf) (brochure on OIDs)
* [http://www.oid-info.com/](http://www.oid-info.com/) (Object Identifier (OID) Repository).

In our initial release, we support only single edges between metadata elements but in the future, we'll allow n-to-m to support entirely generic designs.

> One of the problems of crosswalking is the different degrees of equivalency: one-to-one,
one-to-many, many-to-one, and one-to-none … details may extend from elements-only to elements-plus-qualifiers/refinements or sub-elements. However, usually only the names of the elements and their definitions are taken into consideration in a crosswalk.” (Chan & Zeng, 2006)

In IDISS we follow this model. In the future, we hope to provide some machine learning tools to ease use cases lacking highly qualified domain experts to assist the process of mapping. We propose a set of methods to automatically identify and extract algorithmic pseudo-codes and the sentences that convey related algorithmic metadata using a set of machine-learning techniques such as word vectorization to identify commonalities.

see also: [Semantics](./Docs/Semantics.md)

## Syntax / Encodings

Although our targets are generic metadata standards and don't care about their encoding we start with XML as (syntax) language given its wide use in some of our initial study cases, especially electronic invoices. XML carries, unfortunately, also some baggage, so part of our functionality demands has been to provide validation: syntactical, consistency and completeness checks.

## Design (VSIX)

The "semantic crosswalk editor" has been designed as Visual Studio Code extension.
<IMG SRC="https://user-images.githubusercontent.com/408126/149361233-30279d28-280a-4bd3-b988-f314a0fd4cc3.png" height="35">

Visual Studio Code is a source-code editor made by Microsoft for Windows, Linux and macOS featuring syntax highlighting, intelligent code completion, snippets, code refactoring and embedded Git.

The platform was chosen in great part to its great popularity. In the Stack Overflow 2021 Developer Survey, Visual Studio Code was ranked the most popular developer environment tool, with 70% of 82,000 respondents reporting that they use it.

The editor extension is composed of two parts: a language server extension and a client extension. The server uses the Language Server Protocol (LSP), a common protocol based upon JSON RPC v2.0. It is used to provide language service features to various code editors and not just Visual Studio Code but also Emacs and a host of other editors.

Our client-side is predominantly TypeScript while our server (LSP) makes heavy use of Java.
	
### Versioning
Version control is the only reasonable way to keep track of changes in code, manuscripts, presentations, and data analysis projects. We use Git-- currently by a large margin the most popular(>90% of new projects choose Git) collaborative software development versioning tool. Visual Studio Code as a development basis for editiing tools convientiently provides a Git inferface out-of-the-box. The missing functionality (such as validation) are provided by our extension.
	
## High-level Concept

* [Reused Free Open Source Software (FOSS) Modules - Standing on Shoulders of Giants](docs/Foss.md).
* [Basics on the European e-Invoice Specification (EN16931)](docs/EN16931.md).

## User Documentation

* [Getting Started](docs/GettingStarted.md): How to install the Semantic Crosswalk Editor and get started with Syntax Bindings.
* [Optimizing Workspace](docs/OptimizingWorkspace.md): Setting up the workspace to improve workflow with the SCE extension.
* [SCE Features](docs/Features.md): Comprehensive list of the Semantic Crosswalk Editor key features (with animations to show them in action).
* [XML Features](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs):
  Everything about the underneath XML extension (validation, preferences, formatting, etc).

## Developer Documentation

* [SCE Development](docs/Development.md): How to build and contribute to the Semantic Crosswalk Editor extension.
* [XML Extensions](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs/Extensions.md#extensions):
  How to extend VSCode XML and LemMinX features (completion, validation, hover, etc).

## Endorsements

### [Paul Simons](https://www.linkedin.com/in/paulsimonscb/), Convenor TC434 WG1. Semantic data model

This work is important for the further development and standardisation of e-invoicing in general and more specific to the EN16931 developed by the CEN/TC434 Workgroup.
It will

* Enhance interoperability between the different ERP/Accounting software solutions in the market to the benefit of end-users
* Increase the accuracy of calculations
* Guarantee calculation results independent of the development tools and environment
* Resolve rounding issues in a transparent and predictable way

### [Fred van Blommestein](https://www.linkedin.com/in/fred-van-blommestein-7871b43/), editor of EN16931-1 and convenor of CEN/TC434 WG3 (Syntax binding)

TC434 has limited resources, especially with regard to the very technical work of syntax binding of semantic standards, which needs highly specialized expertise. Two projects within TC434 soon will need this effort: the amendment of EN16931-1 (the semantic standard for an electronic invoice) and the semantic standard for an electronic receipt. The tooling that is developed in this solution is indispensable for this work.

## Supported by

<div>
	<a href="https://www.ngi.eu/"><img alt="Image DAPSI - Data Portability & Services Incubator" src="https://dapsi.ngi.eu/wp-content/uploads/2020/01/NGI_DAPSI_Tag-color-positive-large.png" width="225" height="75" align="left"></a>
</div>
<div>
	<b>Data Portability & Services Incubator (DAPSI) program</b> - <a href="https://dapsi.ngi.eu/">https://dapsi.ngi.eu/</a> <br/>
	<b>EU Grant Agreement No.: 871498</b> - <a href="https://cordis.europa.eu/project/id/871498">https://cordis.europa.eu/project/id/871498</a> <br/>
	<b>Call: H2020-ICT-2018-2020</b>
</div>
