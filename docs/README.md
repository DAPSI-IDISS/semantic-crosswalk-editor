# Semantic-Crosswalk-Editor

Editor to improve Data Interoperability by bridging Standards using human-centric Semantics.

## Background

The general motivation of our project has been (and is) to provide tooling to confront the complex and difficult problem of data schemea transformation as found in metadata and other related standards.

From our perspectives they are all genres of data silos. They occur naturally over time, mirroring organizational structures. As each island (department, company, industry etc.) collects and stores its own data for its own purposes, it creates their own data silo.

This is an important task for not just memory institutions (such as libraries and archives), businesses (needing to interface with external standards such as electronic invoices, messaging etc.) but also for data warehousing projects where one needs, resp. want, to unify data towards improved data quality and a number of side benefits such as collaboration and cost reduction.

Since these "silos" occur over time and tend to be built on internal cultural or local models they often don't quite map to a bigger picture.

Follwing this, the initial focus of IDSS has been to develop a suite of tools to assist cross metadata (semantic) translation for domain experts. In contrast to initiatives such as the "Semantic Web", we don't build up from a projected ontology as there is no single way to model a domain using an ontology. There is no global truth. Different stakeholders in the domain may consider different semantics for metadata or even hold contradictory claims. Often metadata is designed to be intentionally vague and open to the widest range of interpretations and implementations -- see, for example, Dublin Core. The real world is messy and filled with interoperability issues. In standardization, we need to solve them beforehand through interlingua consensus constructed upon formally controlled vocabularies. These demand tools that are not the same as what people tried to develop for the "Semantic Web". we use the data and some tools but don't follow their paradigm down the rabbit hole.

## Overview

The **purpose** of this tool is to mainly handle editing, maintaintance, validation and versioning.

Although our targets are generic metadata standards and don't care about their encoding we start with XML as (syntax) language given its wide use in some of our initial study cases, especially electronic invoices. XML carries, unfortunately, also some baggage, so part of our functionality demands has been to provide validation: syntactical, consistency and completeness checks.

Our first objective has been to provide a Minimum Viable Product (MVP) to interested parties.

We have chosen for the initial "real-world" usage scenario of our tools, the task of maintaining the syntax binding of the EU e-procurement (EU CEN Standard EN16931).

## Overviews

* [Reused Free Open Source Software (FOSS) Modules - Standing on Shoulders of Giants](Foss.md).
* [Semantic Data Transformation](Semantics.md).
* [Versioning](Versioning.md). 
* [Workflow: Using the tooling](Workflow.md)
* [Best Practices](BestPractices.md)
* [Basics on the European e-Invoice Specification (EN16931)](EN16931.md).

## Case Studies
* [MVP Example](Example.md).

## User Documentation

* [Getting Started](GettingStarted.md): How to install the Semantic Crosswalk Editor and get started with Syntax Bindings.
* [Optimizing Workspace](OptimizingWorkspace.md): Setting up the workspace to improve workflow with the SCE extension.
* [SCE Features](Features.md): Comprehensive list of the Semantic Crosswalk Editor key features (with animations to show them in action).
* [XML Features](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs):
  Everything about the underneath XML extension (validation, preferences, formatting, etc).

## Developer Documentation

* [SCE Development](Development.md): How to build and contribute to the Semantic Crosswalk Editor extension.
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
