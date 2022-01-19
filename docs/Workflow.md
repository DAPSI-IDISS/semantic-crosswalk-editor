# Workflow
With workflow one must distinguish between top down and bottom up. With "top-down" we have a given schema superset with a number of subsets albeit with different granularity
and overlaps. This, for example, is the case with the standards built around UN/CEFACT and OASIS UBL. With bottom-up, on the other hand, we have a number of schemas
and look to create a maintainable super-schema for interlingual translation. This is the case with many metadata standards used in memory instutions.

NOTE: The super-schema may or may not be finer grained.

## Bottom-up
* Create and maintain ontologies with the onology toolchain: Protoge and WebOWL (for visualization).
* Create matching superset using the ontology mapper
* Edit and validate using the semantic crosswalk editor.
* Version control into Git (a feature of the crosswalk editor)
* Use a number of tools around Git to explore versioning and documentation reports
* Use and OWLgrapher and using a apporpriate rendering engine (for XML, Apache Fop) to publish (if needed)

## Top-Down
This is our intital use case: the task of maintaining the syntax binding of the EU e-procurement (EU CEN Standard EN16931).
Here we have a super-schema the semantic data model and need to maintain what they call a syntax binding (semantic crosswalk) between it and OASIS UBL and CII.
* View, explore, edit, check consistency and validate with the crosswalk editor.
* Export implicit ontologies
* Create and manage these ontologies with Protoge and use WebOWL for visualization.
* Version control into Git (a feature of the crosswalk editor)
* Use a number of tools around Git to explore versioning and documentation reports
* Use an apporpriate rendering engine (for XML, Apache Fop) to publish (if needed).

NOTE: EU e-procurement (EU CEN Standard EN16931) is published as Excel spreadsheets and PDFs (via Word documents) so we need to also create parallel to our
machine optimized formats also spreadsheets and PDFs. Other use examples may, and will, have other demands. The design is focused on flexibility to enable any
of a number of workflows and deliverable demands.

# Best Practice
Data and experience is still to be collected and evaluated. Our current approach is instead of suggesting a "best" practice to try to enable and
integration of our tools with people's current workflows-- we have some ideas based upon our experience (that is flowing into these tools) but nothing is set in stone and feastues are being added as new needs arrise and new desires ("if only it could do..") are exposed. While new tools and paradigms will inevitabily change and modify the workflows, it remains to seen where this road goes.
be seen what lessions (positive as also negative) ar to be learned.
