"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LicenseAgreement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("non-exclusive");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (["non-exclusive", "exclusive", "buyout"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange(); // Set initial tab based on URL hash
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="container mx-auto py-10 max-w-5xl px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        CheapBeats Tracks Licenses
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          router.push(`/licenses/#${value}`, undefined);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="non-exclusive">Non-Exclusive License</TabsTrigger>
          <TabsTrigger value="exclusive">Exclusive License</TabsTrigger>
          <TabsTrigger value="buyout">Buyout License</TabsTrigger>
        </TabsList>
        <TabsContent value="non-exclusive">
          <LicenseCard
            title="Non-Exclusive License"
            description="This Non-Exclusive Track License Agreement for the licensing of the Track."
            content={nonExclusiveContent}
            pdfUrl="/licenses/non-exclusive.pdf"
          />
        </TabsContent>
        <TabsContent value="exclusive">
          <LicenseCard
            title="Exclusive License"
            description="This Exclusive Track License Agreement for the licensing of the Track."
            content={exclusiveContent}
            pdfUrl="/licenses/exclusive.pdf"
          />
        </TabsContent>
        <TabsContent value="buyout">
          <LicenseCard
            title="Buyout License"
            description="This Track Buyout Purchase Agreement governing the sale of the Track."
            content={buyoutContent}
            pdfUrl="/licenses/buyout.pdf"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LicenseCard({
  title,
  description,
  content,
  pdfUrl,
}: {
  title: string;
  description: string;
  content: string;
  pdfUrl: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div
            className="prose mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </ScrollArea>
        <Button asChild className="w-full">
          <a href={pdfUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

const nonExclusiveContent = `
<div class="boxed__inner">
            <h2 class="text-center">Non-Exclusive License</h2>
            <hr>
            <p>This Non-Exclusive Track License Agreement (this “<u>Agreement</u>”), for the licensing of [the track identified on the CheapBeats Checkout Page and receipt for the transaction, and the stems for said track if purchased] (the “<u>Track</u>”) is a legal agreement between the party granting the license of the Track (“<u>Licensor</u>”) and the party receiving the license of the Track (“<u>Recipient</u>”), as such parties are so identified on the receipt for the transaction (the “<u>Receipt</u>”). Licensor and Recipient are each a “<u>Party</u>” and may be referred to herein collectively as the “<u>Parties.</u>” This Agreement is solely for the licensing of the Track, which was discovered using the platform made available by CheapBeats, Inc. (“<u>CheapBeats</u>”). </p>
            <ol class="nested-counting">
              <li><u>License</u>. Subject to the restrictions in <u>Section 2</u> hereof, Licensor hereby grants to Recipient a non-exclusive, non-transferable, non-sublicensable, time-limited, license, to create one (1) derivative work from the Track by incorporating a vocal melody and lyrics (“<u>Meaningful Additions</u>”) to the Track (the Track once combined with such Meaningful Additions, the “<u>Derivative Work</u>”) for public dissemination (the “<u>License</u>”), solely in connection with promoting Recipient’s music]. Notwithstanding the foregoing, Recipient shall have no rights to exploit the Track separate and apart from its inclusion in a Derivative Work as authorized hereunder. Recipient is not permitted to distribute the Track, other than to the extent the Track is incorporated into a Derivative Work (and then subject to the terms of this Agreement).  For avoidance of doubt, this license is non-exclusive and Licensor may continue to license the Track to other third parties.
                <ol>
                  <li><u>Licensor Likeness Rights</u>. Unless otherwise indicated on the CheapBeats Checkout Page and Receipt, Recipient shall have no right to use the Licensor’s name, stage-name, image, or other indicia of Licensor’s identity and persona to market and promote the Derivative Work. If the CheapBeats Checkout Page and Receipt specify that the Track is licensed “with Likeness Rights” Recipient shall be required to provide attribution to Licensor on all distributions of the Derivative Work by including “Produced by ______________ and Co-written by__________” in the “credits” or “personnel” sections attached to all distributions of the Derivative Work, including without limitation, in any liner notes and meta-data.</li>
                </ol>
              </li>
              <li><u>Restrictions</u>
                <ol>
                  <li>Recipient shall not register the Track or Derivative Work with any performance rights organization.</li>
                  <li>Recipient shall not produce, or authorize the production of, any audio-visual works incorporating the Derivative Work.</li>
                  <li>Recipient is not permitted to register the Track or the Derivate Work with the U.S. Copyright Office</li>
                  <li>Recipient shall only distribute the Derivative Work through the following channels: (i) physical compact discs strictly limited to 1000 prints; (ii) through internet streaming services (collectively, the “<u>Streaming Services</u>”), such as [(x) Spotify; (y) SoundCloud, and (z) Apple Music], strictly limited to 50,000 cumulative streams.  Recipient is prohibited from making use of the song on any monetized YouTube video or channel.</li>
                  <li>Recipient may engage in any live public performances of the Derivative Work, including Terrestrial Radio, but excluding any Television Broadcast. However, distribution of the Track or the Derivative work to Terrestrial Radio is prohibited.</li>
                  <li>Recipient is not permitted to grant any synchronization licenses to the Track or of the Derivative work.</li>
                  <li>Recipient is not permitted to distribute the Track as is (without Meaningful Additions) under any circumstance.</li>
                </ol>
              </li>
              <li><u>Payment</u>. In exchange for the License, Recipient shall pay the fee (the “Fee”) set forth [on the CheapBeats Checkout Page and Receipt]. The Fee is non-negotiable, non-refundable and non-recoupable.</li>
              <li><u>Ownership</u>. Licensor shall continue to own all right, title, and interest in and to the master recording and composition of the Track, and nothing herein shall constitute an assignment of any such rights. For the avoidance of doubt, Recipient shall not own the intellectual property rights to the composition or sound recording of the Derivative Work.  Recipient is solely licensed the right to use the Track in the Derivate Work and to exploit the Derivative Work in accordance with the terms and conditions of this Agreement.  Licensor does not intend to grant any rights in or to any other derivative works of the Track that may have been created by third parties. All Meaningful Additions written and recorded by Recipient shall be owned by Recipient. The parties do not intend to create joint work.
                <ol>
                  <li>Following any termination of this License, Recipient shall be able to continue using (and owning) all Meaningful Additions that had been layered over the Track, and under no circumstances shall such layered materials be deemed owned by Licensor. However, as the License shall have terminated, Recipient shall be forbidden from making any other use of the Derivative Work, absent the purchase of another license to utilize the Track.</li>
                </ol>
              </li>
              <li><u>Representations, Warranties and Covenants.</u> Licensor represents, warrants, and covenants that (i) Licensor owns, or controls the copyright in the composition and master recording of the Track; (ii) to the extent any third-party intellectual property (“<u>Third-Party IP</u>”) has been incorporated into the Track, Licensor has obtained all necessary rights from all applicable third-parties for (x) the inclusion of such Third-Party IP in the Track, and (y) Licensor to be able to grant the rights to Recipient contemplated herein with no consents required of, or any additional costs due to, any third party for any use of the Track by Recipient made in accordance with this Agreement; and (iii) that the Track, as provided to Recipient, does not infringe or misappropriate the intellectual property rights or any other rights of any third party.</li>
              <li>Indemnification
                <ol>
                  <li>Licensor will indemnify, defend, and hold harmless Recipient and CheapBeats and their respective officers, directors, members, managers, employees, and agents from and against any damages, losses, costs, expenses, and liabilities (including reasonable attorneys’ fees) incurred by such parties in connection with any third-party claim, action, or proceeding based on or arising from Licensor’s breach of any of the representations, warranties, or covenants of <u>Section 5</u>.</li>
                  <li>Recipient will indemnify, defend, and hold harmless Licensor and CheapBeats and their respective officers, directors, members, managers, employees, and agents from and against any damages, losses, costs, expenses, and liabilities (including reasonable attorneys’ fees) incurred by such parties in connection with any third-party claim, action, or proceeding based on or arising from any allegation that the Derivative Work infringes upon the intellectual property rights or other proprietary rights of any third party, other than to the extent such Losses are covered under <u>Section 6.1</u> above.</li>
                </ol>
              </li>
              <li>Termination
                <ol>
                  <li>If Recipient is in material breach of this Agreement and fails to cure such breach within fifteen (15) days of receiving written notice, the Licensor may terminate this Agreement.</li>
                  <li>This Agreement (and the License) shall automatically terminate upon the earlier of the following: (i) the date that is [twenty four (24) months from the date of purchase of the License as indicated on the Receipt)]; or (ii) the Derivative Work having reached a combined count of [50,000] number of streams across the Streaming Platforms.</li>
                  <li>Upon any termination or expiration of this Agreement, all rights in the Derivative Work, other than with respect to any Meaningful Additions, and the Track shall revert to the Licensor, and all Sections of this Agreement (other than those specified in Section 7.4 below) shall hereby terminate.</li>
                  <li>Upon any termination or expiration of this Agreement, Sections 4-8 shall survive.</li>
                  <li>Following termination of this Agreement, Recipient shall use reasonable efforts to remove the Derivative Work from the Streaming Services. For the avoidance of doubt, any physical embodiment of the Derivative Work created and distributed during the term of this Agreement by or on behalf of Recipient in accordance with this Agreement does not need to be recovered, destroyed, or otherwise reverse distributed upon the expiration or termination of this Agreement.</li>
                </ol>
              </li>
              <li><u>General</u>. CheapBeats is an express, intended, third-party beneficiary under this Agreement.  Neither Party may assign this Agreement without the prior, written consent of the other Party.  This Agreement, forms the entire agreement between the Parties with respect to the Track and overrides any and all prior agreements or negotiations between the Parties with respect to the Track.  No changes or modifications or waivers to this Agreement will be effective unless in writing and agreed to by both Parties (including via e-mail).  If any provision of this Agreement is determined to be illegal or unenforceable, that provision will be limited or eliminated to the minimum extent necessary so that this Agreement remains in full force and effect and enforceable.  This Agreement, and any and all disputes directly or indirectly arising out of or relating to this Agreement, will be governed by and construed in accordance with the laws of the State of New York, without reference to the choice of law rules thereof.  Headings herein are for convenience of reference only and in no way affect interpretation of the Agreement.</li>
            </ol>
          </div>
`;

const exclusiveContent = `
<div class="boxed__inner">
            <h2 class="text-center">Exclusive License</h2>
            <hr>
            <p>This Exclusive Track License Agreement (this “<u>Agreement</u>”), for the licensing of [the track identified on the CheapBeats Checkout Page and receipt for the transaction, and stems for said track if purchased] (the “<u>Track</u>”) is a legal agreement between the party granting the license of the Track (“<u>Licensor</u>”) and the party receiving the license of the Track (“<u>Recipient</u>”), as such parties are so identified on the receipt for the transaction (the “<u>Receipt</u>”). Licensor and Recipient are each a “<u>Party</u>” and may be referred to herein collectively as the “<u>Parties.</u>” This Agreement is solely for the licensing of the Track, which was discovered using the platform made available by CheapBeats, Inc. (“<u>CheapBeats</u>”).</p>
            <ol class="nested-counting">
              <li>
                <u>License</u>. Licensor hereby grants to Recipient an exclusive go-forward (including as to Licensor, but subject to any previously granted licenses as described in subsection (a) below) license, throughout the universe, to use, reproduce, modify, distribute, publicly perform, in order to create one (1) derivative work from the Track by incorporating a vocal melody and lyrics (“Meaningful Additions”) to the Track (the Track once combined with such Meaningful Additions, the “<u>Derivative Work</u>”) for public dissemination (the “<u>License</u>”). Notwithstanding the foregoing, Recipient shall have no rights to exploit the Track separate and apart from its inclusion in a Derivative Work as authorized hereunder. Recipient is not permitted to distribute the Track, other than to the extent the Track is incorporated into a Derivative Work (and then subject to the terms of this Agreement).
                <br>
                (a) The Track may have been licensed previously, and such licenses may be outstanding. Licensor shall be under no obligation to terminate any such previously granted licenses.
                <br>(b) The Track may contain Third-Party IP (as defined below). If Third-Party IP is incorporated into the Track, Recipient’s rights to such Third-Party IP shall be no greater than those rights currently held by Licensor. Therefore, although Recipient’s rights to the Track, taken as a whole, shall be exclusive, Recipient’s rights to such Third-Party IP shall be non-exclusive.
                <ol>
                  <li><u>Licensor Likeness Rights</u>. Unless otherwise indicated on the CheapBeats Checkout Page and Receipt, Recipient shall have no right to use the Licensor’s name, stage-name, image, or other indicia of Licensor’s identity and persona to market and promote the Derivative Work. If the CheapBeats Checkout Page and Receipt specify that the Track is licensed “with Likeness Rights” Recipient shall be required to provide attribution to Licensor on all distributions of the Derivative Work by including “Produced by ______________ and Co-written by__________” in the “credits” or “personnel” sections attached to all distributions of the Derivative Work, including without limitation, in any liner notes and meta-data.</li>
                </ol>
              </li>
              <li><u>Payment</u>. In exchange for the License, Recipient shall pay the fee (the “<u>Fee</u>”) set forth [on the CheapBeats Checkout Page and Receipt]. The Fee is non-negotiable, non-refundable and non-recoupable (including without limitation by being offset against any royalties that may become due).  In addition, Recipient shall register Licensor as co-writer with a PRO (as defined below) in accordance with <u>Section 3.1</u>.
              </li>
              <li><u>Ownership and Registrations</u>. Other than as explicitly set forth herein, Licensor shall continue to own all right, title, and interest in and to the master recording and composition of the Track, and nothing herein shall constitute an assignment of any such rights. Subject to the terms of this Agreement, the composition of the Derivative Work, as well as any sound recordings of the Derivative Work created by Recipient, shall be owned by Recipient. Licensor does not intend to grant any rights in or to any other derivative works of the Track that may have been created by third parties. For the avoidance of doubt, because Recipient must make a Meaningful Additions in order for a Derivative Work to be created, any other manipulation of the Track, or minor additions, shall not constitute the creation of a Derivative Work, and therefore any such creative material produced that does not constitute a Meaningful Addition shall be owned by Licensor.
                <ol>
                  <li><u>Economic Interest in Publishing Royalties</u>. Notwithstanding the foregoing, if and when Recipient registers the Derivative Work with a performance rights organization (each a “<u>PRO</u>”), Recipient shall include Licensor as a co-writer of the Derivative Work (or equivalent designation with the applicable PRO as necessary to document with the PRO that Licensor shall be entitled to 50% of all amounts payable by the PRO to anyone, including Licensor, or any other writers or publishers designated when registering with a PRO, with respect to the Derivative Work).</li>
                  <li><u>Rights Apart From Derivative Work</u>. Following any termination of this License
                    <br>
                    (a) Recipient shall continue to own the Derivative Work. However, Recipient shall not be able to enjoy any rights in the Derivative Work to the extent it continues to incorporate the Track, as the Recipient’s license to use the Track shall have terminated.
                    <br>
                    (b) Recipient shall be able to continue using (and owning) all materials created by the Recipient (including any additional original music or lyrics composed by Recipient) that had been layered over the Track, and under no circumstances shall such layered materials be deemed owned by Licensor.
                    <br>
                    (c) Licensor shall be free from any restrictions regarding its own enjoyment or ability to license the Track.
                  </li>
                </ol>
              </li>
              <li><u>Representations, Warranties and Covenants</u>. Licensor represents, warrants, and covenants that: (i) Licensor owns, or controls the copyright in the composition and master recording of the Track, and that the Track, as provided to Recipient, does not infringe or misappropriate the intellectual property rights or any other rights of any third party; (ii) to the extent any third-party intellectual property (“<u>Third-Party IP</u>”) has been incorporated into the Track, Licensor has obtained all necessary rights from all applicable third-parties for (x) the inclusion of such Third-Party IP in the Track, and (y) Licensor to be able to grant the rights to Recipient contemplated herein with no consents required of, or any additional costs due to, any third party for any use of the Track by Recipient made in accordance with this Agreement; (iii) other than as set forth in this Agreement, there are no restrictions or limitations as to the use of the Track by Recipient; (iv) Licensor is not a member of any union or guild in which membership would prevent Licensor from granting the License or require Recipient to become a signatory to the collective bargaining agreement of any union or guild; and (v) Licensor has all right and authority to grant the License and enter into this Agreement.
              </li>
              <li>Indemnification
                <ol>
                  <li>Licensor will indemnify, defend, and hold harmless Recipient and CheapBeats and their respective officers, directors, members, managers, employees, and agents from and against any damages, losses, costs, expenses, and liabilities (including reasonable attorneys’ fees) incurred by such parties in connection with any third-party claim, action, or proceeding (collectively, “<u>Losses</u>”) based on or arising from Licensor’s breach of any of the representations, warranties, or covenants of <u>Section 4</u>.</li>
                  <li>Recipient will indemnify, defend, and hold harmless Licensor and CheapBeats and their respective officers, directors, members, managers, employees, and agents from and against any Losses based on or arising from any allegation that the Derivative Work infringes upon the intellectual property rights or other proprietary rights of any third party, other than to the extent such Losses are covered under <u>Section 5.1</u> above. </li>
                </ol>
              </li>
              <li><u>Termination</u>. If either Party is in material breach of this Agreement and fails to cure such breach within thirty (30) days of receiving written notice, the other Party may terminate this Agreement. This Agreement (and the License) shall continue in perpetuity, unless terminated in accordance with this <u>Section 6</u>. Upon any termination or expiration of this Agreement, <u>Section 2</u> (to the extent any Fee remains outstanding, provided such termination did not arise as a result of Licensor’s breach of this Agreement), <u>Section 3</u>, and <u>Sections 5-7</u>, shall survive.
                <ol>
                  <li>Following termination of this Agreement, Recipient shall use reasonable efforts to remove the Derivative Work from any internet streaming websites or other avenues of publication, to the extent the ability to do so is within Recipient’s reasonable control. For the avoidance of doubt, any physical embodiment of the Derivative Work created and distributed during the term of this Agreement by or on behalf of Recipient in accordance with this Agreement does not need to be recovered, destroyed, or otherwise reverse distributed upon the expiration or termination of this Agreement. </li>
                </ol>
              </li>
              <li><u>General</u>. CheapBeats is an express, intended, third-party beneficiary under this Agreement, but is not a party to the Agreement. Neither Party may assign this Agreement without the prior, written consent of the other Party.  This Agreement, forms the entire agreement between the Parties with respect to the Track and overrides any and all prior agreements or negotiations between the Parties with respect to the Track.  No changes or modifications or waivers to this Agreement will be effective unless in writing and agreed to by both Parties (including via e-mail).  If any provision of this Agreement is determined to be illegal or unenforceable, that provision will be limited or eliminated to the minimum extent necessary so that this Agreement remains in full force and effect and enforceable.  This Agreement, and any and all disputes directly or indirectly arising out of or relating to this Agreement, will be governed by and construed in accordance with the laws of the State of New York, without reference to the choice of law rules thereof.  Headings herein are for convenience of reference only and in no way affect interpretation of the Agreement.</li>
            </ol>
          </div>
`;

const buyoutContent = `
<div class="boxed__inner">
            <h2 class="text-center">Buyout License</h2>
            <hr>
            <p>This Track Buyout Purchase Agreement (this “<u>Agreement</u>”) is a legal agreement governing the sale of [the track identified on the CheapBeats Checkout Page and receipt for the transaction, and the stems for said track if purchased] (the “<u>Track</u>”), between the party selling the Track (“<u>Seller</u>”) and the party receiving [conditional] ownership of the Track (“<u>Recipient</u>”), as such parties are so identified on the receipt for the transaction (the “<u>Receipt</u>”). For good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, Seller and Recipient hereby agree as follows:</p>
            <ol class="nested-counting">
              <li><u>Payment</u>.  In full and complete consideration to Seller for entering into this Agreement, and for all rights transferred by Seller to Recipient hereunder, Recipient agrees to pay, and Seller agrees to accept, the fee set forth on the CheapBeats Checkout Page and Receipt (the “<u>Fee</u>”).   The fee is non-refundable and non-recoupable.</li>
              <li><u>Ownership</u>.  Seller hereby irrevocably assigns and transfers to Recipient all of Seller’s right, title and interest, in and to, the Track, including, without limitation, all copyrights and any other intellectual property or proprietary rights embodied therein (the “<u>Rights</u>”). For the avoidance of doubt, the Rights includes all copyrights in both the Track’s composition and any sound recordings thereof.   Seller hereby irrevocably waives any and all of Seller’s moral rights with respect to the Track.  Although Recipient shall have the right to use and exploit the Track as set forth herein, Recipient shall have no obligation to, nor does Recipient make any warranty or representation that Recipient shall, do so, or that Recipient will produce, release, use, or distribute the Track. The Rights shall include, without limitation, all copyrights, neighboring rights, trademarks, and any and all other ownership and exploitation rights in the Track now or hereafter recognized in any and all territories and jurisdictions, including, without limitation, production, reproduction, distribution, adaptation, performance, fixation, rental and lending rights, exhibition, broadcast, and all other rights of communication to the public, and the right to exploit the Track throughout the universe in perpetuity in all media, markets, and languages and in any manner now known or hereafter devised Unless otherwise indicated on the CheapBeats Checkout Page and Receipt, Recipient shall have no right to use the Licensor’s name, stage-name, image, or other indicia of Licensor’s identity and persona to market and promote the Derivative Work. If the CheapBeats Checkout Page and Receipt specify that the Track is licensed “with Likeness Rights”, Recipient shall have the right, but not the obligation, to use Seller’s name, image, and likeness in connection with the Materials; provided that no such use shall endorse any product, service, or company.  The Track may have been licensed previously, and such licenses may be outstanding. Licensor shall be under no obligation to terminate any such previously granted licenses. For the avoidance of doubt, to the extent any Third-Party IP (as defined below) is incorporated into the Track, Recipient’s rights to such Third-Party IP shall be no greater than those rights currently held by Seller. Therefore, although Recipient’s shall, upon execution of this Agreement, own the intellectual property rights embodied in the Track taken as a whole, Recipient’s shall not own such Third-Party IP. </li>
              <li><u>Representations and Warranties</u>.  Seller represents and warrants that: (i) the Track does not infringe or misappropriate the intellectual property rights or any other rights of any third party; (ii) to the extent any third-party intellectual property (“<u>Third-Party IP</u>”) has been incorporated into the Track, Seller has obtained all necessary rights from all applicable third-parties for (x) the inclusion of such Third-Party IP in the Track, and (y) Seller to be able to grant the rights to Recipient contemplated herein with no consents required of, or any additional costs due to, any third party for any use of the Track by Recipient made in accordance with this Agreement; and (iii) there are no restrictions or limitations as to the use of the Track by Recipient or its successors, licensees, or designees in any and all media perpetually throughout the universe.</li>
              <li><u>Indemnification</u>. Seller will indemnify, defend, and hold harmless Recipient and CheapBeats, Inc. (“<u>CheapBeats</u>”) and their respective officers, directors, members, managers, employees, and agents from and against any damages, losses, claims, suits, or proceedings (including, without limitation, reasonable attorneys’ fees and expenses) based on or arising from Seller’s breach of any of the representations and warranties hereunder. Recipient will indemnify, defend, and hold harmless Seller and CheapBeats and their respective officers, directors, members, managers, employees, and agents from and against any damages, losses, claims, suits, or proceedings (including, without limitation, reasonable attorneys’ fees and expenses) based on or arising from a claim that a derivative work of the Track infringes or misappropriates the intellectual property rights of any third party, other than to the extent such infringement claim arises from a breach by Seller of the representation and warranties hereunder.</li>
              <li><u>Covenants</u>.  Recipient agrees not to grant any sync licenses for the Track in its unaltered state. Recipient shall only be allowed to grant sync licenses for derivative works of the Track, and only if such derivative works include the addition of a vocal melody and lyrics (“Meaningful Additions”) to the audio of the Track. Notwithstanding the foregoing, Recipient shall be allowed to sync the Track in connection with one (1) audio-visual production, where such audio-visual production’s primary purpose is to promote the Track and/or Recipient, but not for any other commercial purposes. Should Recipient assign any of the Rights to any third party, such third party must accept the ongoing covenants of this <u>Section 5</u> as well.</li>
              <li><u>Termination and Reversion</u>. If Recipient violates its covenants in <u>Section 5</u> of this Agreement, ownership of the Track and all of the Rights shall automatically revert back to Seller (a “<u>Reversion</u>”), and Seller shall be under no obligation to return the Fee. This Agreement shall terminate upon any such Reversion. </li>
              <li><u>General</u>. CheapBeats is an express, intended, third-party beneficiary under this Agreement.  Seller’s rights and remedies in the event of a breach or alleged breach hereof shall be limited to recovery of amounts owed to Seller, but Seller will not be entitled to restrain or enjoin the exploitation of the Track and hereby irrevocably waives any right to seek injunctive relief.  This Agreement and the business terms set forth on the Receipt with respect to the Track is the entire agreement between the parties with respect to the subject matter hereof, and supersedes any and all prior agreements, negotiations, representations, and understandings between the parties with respect to such subject matter.  The failure of either party to enforce its rights under this Agreement at any time for any period shall not be construed as a waiver of such rights.  No changes or modifications or waivers to this Agreement will be effective unless in writing and signed by both parties.  In the event that any provision of this Agreement shall be determined to be illegal or unenforceable, that provision will be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable.  This Agreement, and any and all disputes directly or indirectly arising out of or relating to this Agreement, will be governed by and construed in accordance with the laws of the State of New York, without reference to the choice of law rules thereof.  The parties hereby consent and agree to the exclusive jurisdiction of the courts of the State of New York for all suits, actions, or proceedings directly or indirectly arising out of or relating to this Agreement, and waive any and all objections to such courts.  Headings herein are for convenience of reference only and shall in no way affect interpretation of the Agreement.  </li>
            </ol>
          </div>
`;
