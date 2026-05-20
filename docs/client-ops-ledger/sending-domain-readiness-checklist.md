# Sending Domain Readiness Checklist

Use this before approving any Reach campaign start-drip action.

## Per-Lane Readiness

Fill `sending-domain-readiness.csv` before Manager asks Mike for start-drip approval.

| Check | Required before import | Required before start drip |
|---|---|---|
| Dedicated subdomain is filled in | yes | yes |
| Warmup status is known | yes | yes |
| Daily send volume is known | yes | yes |
| SPF/DKIM/DMARC are passing in the sending system | no | yes |
| GHL workflow start tag is confirmed | no | yes |
| Correct lane/subdomain pairing is confirmed | no | yes |
| HighLevel AI features are OFF | yes | yes |
| Test contact path is verified | no | yes |

## Lane Mapping

| Lane | Start tag | Import-only tag |
|---|---|---|
| Reviews | `aoh_campaign_reviews_start` | `aoh_campaign_reviews_imported` |
| AI Visibility | `aoh_campaign_ai_visibility_start` | `aoh_campaign_ai_imported` |
| Relay | `aoh_campaign_relay_start` | `aoh_campaign_relay_imported` |

## GHL Expert Signoff

```text
Lane:
Dedicated subdomain:
Warmup status:
Allowed daily send volume:
Workflow checked:
Start tag checked:
Import tag checked:
HighLevel AI features confirmed OFF:
Test contact result:
Recommended action: import only | start drip | wait
Checked by:
Checked at:
```

## Hard Rule

If the sending subdomain is still warming, Manager may ask Mike for import-only approval, but should not ask for start-drip approval unless GHL Expert marks the lane ready for drip.
