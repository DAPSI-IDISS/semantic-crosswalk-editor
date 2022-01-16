## Cross Walks


> "A crosswalk is a set of transformations applied to the content of elements in a source
metadata standard that result in the storage of appropriate modified content in the analogous elements of a target metadata standard. A complete or fully specified crosswalk
consists of both a semantic mapping and a metadata conversion specification. The
metadata conversion specification contains the transformations required to convert the
metadata record content compliant to a source metadata standard into a record whose
contents are compliant with a target metadata standard." -- (St. Pierre & LaPlant, 1998)

> One of the problems of crosswalking is the different degrees of equivalency: one-to-one,
one-to-many, many-to-one, and one-to-none … details may extend from elements-only to elements-plus-qualifiers/refinements or sub-elements. However, usually only the names of the elements and their definitions are taken into consideration in a crosswalk.” (Chan
& Zeng, 2006) 

This means that when mapping individual elements, often there are no exact equivalents.
Meanwhile, many elements are found to overlap in meaning and scope. For this reason, data conversion based on crosswalks could create quality problems. (Chan & Zeng, 2006)

This discussion of ‘degrees of equivalency’ exemplifies one of the problems of mapping: the
concept of equivalence is described in binary terms but then discussed in terms of levels or degrees of exactness. It is hard to translate this into data conversion algorithms that must make a yes/no decision about whether data can be effectively moved between elements ‘mapped’ to each
other. This inability to effectively express a degree of exactness lies at the core of the ‘quality
problems’ noted above.


## The Messy Word

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
