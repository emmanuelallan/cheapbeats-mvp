import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-center">
            Find answers to common questions about our music licensing services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What types of licenses do you offer?
              </AccordionTrigger>
              <AccordionContent>
                We offer three main types of licenses: Non-Exclusive, Exclusive,
                and Buyout. Each license type grants different rights and has
                different terms. Please refer to our Licenses page for detailed
                information on each type.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What&apos;s the difference between Non-Exclusive and Exclusive
                licenses?
              </AccordionTrigger>
              <AccordionContent>
                A Non-Exclusive license allows the licensor to continue
                licensing the track to others, while an Exclusive license grants
                the recipient exclusive rights to use the track (subject to any
                previously granted licenses). Exclusive licenses typically cost
                more but provide more control over the track&apos;s usage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What does a Buyout license include?
              </AccordionTrigger>
              <AccordionContent>
                A Buyout license transfers ownership of the track to the
                recipient, including all copyrights and other intellectual
                property rights. However, there may be some limitations
                regarding third-party IP incorporated into the track.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Can I use the track as is, or do I need to add something to it?
              </AccordionTrigger>
              <AccordionContent>
                For Non-Exclusive and Exclusive licenses, you are required to
                create a derivative work by adding &quot;Meaningful
                Additions&quot; such as vocal melodies and lyrics to the track.
                For Buyout licenses, you have more flexibility in how you use
                the track.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Are there any restrictions on how I can use the licensed track?
              </AccordionTrigger>
              <AccordionContent>
                Yes, there are restrictions depending on the license type. For
                example, Non-Exclusive licenses have limitations on distribution
                channels and the number of streams. Always refer to the specific
                terms in your license agreement for detailed usage restrictions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Do I need to credit the original producer?
              </AccordionTrigger>
              <AccordionContent>
                Credit requirements depend on whether your license includes
                &quot;Likeness Rights.&quot; If it does, you&apos;re required to
                provide attribution to the licensor in the credits or personnel
                sections of all distributions of the derivative work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>
                Can I register the track with a performance rights organization
                (PRO)?
              </AccordionTrigger>
              <AccordionContent>
                This depends on the license type. For Non-Exclusive licenses,
                you cannot register the track or derivative work with a PRO. For
                Exclusive licenses, you can register the derivative work but
                must include the licensor as a co-writer with specific royalty
                splits.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>
                What happens if I violate the terms of the license agreement?
              </AccordionTrigger>
              <AccordionContent>
                Violating the terms of the license agreement can result in
                termination of the license. In the case of a Buyout license,
                ownership of the track may revert back to the seller. It&apos;s
                crucial to adhere to all terms specified in your license
                agreement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger>
                Can I transfer or resell my license to someone else?
              </AccordionTrigger>
              <AccordionContent>
                Generally, the licenses are non-transferable. This means you
                cannot sell or transfer your license to another party. Always
                check the specific terms in your license agreement for any
                exceptions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger>
                What is Cheapbeats&apos;s role in the licensing process?
              </AccordionTrigger>
              <AccordionContent>
                Cheapbeats is the platform through which you discovered the
                track. While they facilitate the connection between licensors
                and licensees, the actual license agreement is between you and
                the track&apos;s owner. Cheapbeats is considered a third-party
                beneficiary in the license agreements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
