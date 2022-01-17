## Cross Walks


> "A crosswalk is a set of transformations applied to the content of elements in a source
metadata standard that result in the storage of appropriate modified content in the analogous elements of a target metadata standard. A complete or fully specified crosswalk consists of both a semantic mapping and a metadata conversion specification. The metadata conversion specification contains the transformations required to convert the metadata record content compliant to a source metadata standard into a record whose contents are compliant with a target metadata standard." -- (St. Pierre & LaPlant, 1998)

> One of the problems of crosswalking is the different degrees of equivalency: one-to-one, one-to-many, many-to-one, and one-to-none … details may extend from elements-only to elements-plus-qualifiers/refinements or sub-elements. However, usually only the names of the elements and their definitions are taken into consideration in a crosswalk.” (Chan & Zeng, 2006) 

We also have issues of granularity and scope.

> This means that when mapping individual elements, often there are no exact equivalents.
Meanwhile, many elements are found to overlap in meaning and scope. For this reason, data conversion based on crosswalks could create quality problems. (Chan & Zeng, 2006)

The concept of ‘degrees of equivalency’ exemplifies one of the problems of mapping: the concept of equivalence is described as a truth function (persistent to change in the light of knowledge) but then discussed in terms of fuzzy  levels or degrees of exactness. This inability to effectively express a degree of exactness and consider the nonmonotocity of knowledge lies at the core of the ‘quality problems’.

> In comparing two or more metadata element sets or schemas, distinctions and similarities must be understood on multiple levels to evaluate the degree to which they are interoperable. One definition of interoperability is “the ability of different types of computers, networks, operating systems, and applications to work together effectively, without prior communication, in order to exchange information in a useful and meaningful manner. There are three aspects of interoperability: semantic, structural, and syntactical.” -- Metadata Matters: Connecting People and Information, Mary S. Woodley

(continuing with Woodley's paper)

> Some of the common misalignments that occur when mapping between metadata include:
> * Fuzzy matches: A concept in the original database does not have a perfect equivalent in the target database. For example, when mapping the creation-creator-identity-nationality/culture/race elements in Categories for the Description of Works of Art (CDWA) to the subject element in Dublin Core, which does not have the same exact meaning. Since the Dublin Core subject element is a much broader category, this is a “fuzzy” match.
> * Hybrid records: Although some metadata standards (e.g., Dublin Core) follow the principle of a one-to-one relationship between a metadata record and an “item”—be it analog or digital—in practice many memory institutions use a single metadata record to record information about an original object as well as its digital surrogate, thus creating a sort of “hybrid” record. When migrating and harvesting data, this may pose problems if the harvester cannot distinguish between the elements that describe the original item and those that describe the digital surrogate.
> * One element into many: Data that exists in one element in the original schema may exist in separate elements in the target database. For example, the CDWA creation-place element may appear in the subject and the coverage elements in Dublin Core.
> * Many elements into one: Data in separate elements in the original schema may be in a single element in the target schema. For example, in CDWA the birth and death dates for a “creator” are recorded in the creator-identity-dates element as well as in other elements, all apart from the element for the creator’s name. In the MARC format, birth and death dates are a “subfield” in the string for the “author’s” name.
> * No correspondence: There is no element in the target schema equivalent to the element in the original schema, and unrelated data may be forced into a single “bucket” with unrelated or loosely related content.
> * Evolving standards: In some cases, the original “standard” is actually a mix of standards that evolved over time. Kurth, Ruddy, and Rupp have pointed out that even in transforming metadata from a single metadata standard, it may not be possible to use the same conversion mapping for all records. The Cornell University Library metadata project revealed the difficulties in “transforming” MARC library records to TEI (Text Encoding Initiative). Not only had the use of MARC in the library evolved over time, but the rules guiding how content was added had changed from pre–Anglo-American Cataloguing Rules to AACR2rev. Some MARC subelements were dropped, and others were added, so that various communities could more easily reuse library records for their own purposes. The conversion of library records created according to AACR2rev in order to make them conform with the new cataloging standard, Resource Description and Access (RDA), is beyond the scope of this chapter. In the years to come, as more and more libraries create original bibliographic records according to RDA, interesting challenges are sure to emerge.
> * Incomplete correspondence: In only a few cases does the mapping work equally well in both directions, due to differences in granularity and community-specific practices (see number 2 above.) The large Getty metadata crosswalk19 was created by mapping in a single direction: CDWA was analyzed, and other data systems were mapped to its elements. However, there are some types of information recorded in MARC that are lost in this process; for example, the publisher and language elements are important in library records but are less relevant to CDWA.
> * Differing structures: One metadata set may have a hierarchical structure with complex relationships while the other may have a flat file organization—EAD (hierarchical) versus MARC (flat), for example.



## The Messy Word

In above we spoke of issues of granularity and scope or context. This is particilarly found in many items where one, given cultural bias, least expects them. A case in point are weights and measures and addresses

### Example: Weights and measure: barrels
One would think with S.I. units any problems with weight and measure translation would be a trivial conversion. It, unfortunately, is not. Throughout the world we have, for example, something called a 55 gallon barrel. 


### Example: Address
#### US Centric Approach
#### Japanese Paradigm
#### Addresses in UK and Ireland
#### Addresses without names?

In Ghana, finding your way around can be a challeng since properties often don't have a house number or name and street signs are rarely visible,
local landmarks like bars, banks or even trees are used instead to help people find their way. Using palm trees, speed bumps, street vendors, etc.
works but the system is far from persistant. Palm tree can be cut down and street vendors can change their location.

Because of this the World Bank a few years ago initiated a program to create digital adresses. 3,782 street signs were erected, and 12,952 signs
were posted in 2015. Street names are, however, not persistant and families and groups can easily move to have streets named or renamed. To address
the persistancy issue Ghana uses also now digital addresses.

Digital addresses have the form CODE-XXX-XXX.

Example: The address AK-039-5028 is for the Kumasi Main Post Office. In a deconstructed form, AK-039 is the postal code for the area, A refers to the region of the location (Ashanti Region), while K refers to the district (Kumasi District), 5028 


![image](https://user-images.githubusercontent.com/408126/149522905-9b88f8d2-8cf3-4bd6-bd52-668d0271bbff.png)
